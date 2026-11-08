<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class ThreeXUiOnePortSeoTest extends TestCase
{
    public function test_three_x_ui_one_port_has_its_own_metadata_and_content_without_javascript(): void
    {
        $this->withoutVite();
        $response = $this->get('/guides/3x-ui-one-port');
        $response->assertOk();

        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);
        $url = 'https://denpiligrim.ru/guides/3x-ui-one-port';

        $this->assertSame(1, $xpath->query('//head/title')->length);
        $this->assertStringContainsString('3x-ui:', $xpath->evaluate('string(//head/title)'));
        $this->assertSame(1, $xpath->query('//meta[@name="description"]')->length);
        $this->assertSame(1, $xpath->query('//link[@rel="canonical"]')->length);
        $this->assertSame($url, $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame($url, $xpath->evaluate('string(//meta[@property="og:url"]/@content)'));
        $this->assertSame('article', $xpath->evaluate('string(//meta[@property="og:type"]/@content)'));
        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame(1, $xpath->query('//h1')->length);
        $this->assertStringContainsString('3x-ui:', $xpath->evaluate('string(//h1)'));
        $this->assertSame(4, $xpath->query('//main/h3')->length);

        $schemas = [];
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
            $data = json_decode($script->textContent, true, 512, JSON_THROW_ON_ERROR);
            $schemas[$data['@type']] = $data;
        }
        $this->assertEqualsCanonicalizing(['TechArticle', 'BreadcrumbList'], array_keys($schemas));
        $this->assertSame($url, $schemas['TechArticle']['mainEntityOfPage']);
        $this->assertSame('3x-ui: подключения на одном порту', $schemas['BreadcrumbList']['itemListElement'][2]['name']);
        $this->assertSame($url, $schemas['BreadcrumbList']['itemListElement'][2]['item']);
    }

    public function test_three_x_ui_one_port_metadata_does_not_leak_into_other_routes(): void
    {
        $this->withoutVite();
        $this->get('/guides')->assertOk()->assertDontSee('3x-ui: инструкция');
        $this->get('/guides/openflux')->assertOk()->assertDontSee('3x-ui: инструкция');
        $this->get('/guides/cdn-selectel')->assertOk()->assertDontSee('3x-ui: инструкция');
    }

    public function test_sitemap_includes_three_x_ui_one_port_once(): void
    {
        $document = new DOMDocument();
        $document->load(public_path('sitemap.xml'));
        $xpath = new DOMXPath($document);
        $xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $this->assertSame(1, $xpath->query('//s:loc[text()="https://denpiligrim.ru/guides/3x-ui-one-port"]')->length);
    }
}
