<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class CdnSetupSeoTest extends TestCase
{
    public function test_cdn_setup_has_its_own_metadata_and_content_without_javascript(): void
    {
        $this->withoutVite();
        $response = $this->get('/guides/cdn-setup');
        $response->assertOk();

        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);
        $url = 'https://denpiligrim.ru/guides/cdn-setup';

        $this->assertSame(1, $xpath->query('//head/title')->length);
        $this->assertStringContainsString('CDN для VLESS XHTTP', $xpath->evaluate('string(//head/title)'));
        $this->assertSame(1, $xpath->query('//meta[@name="description"]')->length);
        $this->assertSame(1, $xpath->query('//link[@rel="canonical"]')->length);
        $this->assertSame($url, $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame($url, $xpath->evaluate('string(//meta[@property="og:url"]/@content)'));
        $this->assertSame('article', $xpath->evaluate('string(//meta[@property="og:type"]/@content)'));
        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame(1, $xpath->query('//h1')->length);
        $this->assertStringContainsString('VLESS XHTTP', $xpath->evaluate('string(//h1)'));
        $this->assertSame(4, $xpath->query('//main/h3')->length);

        $schemas = [];
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
            $data = json_decode($script->textContent, true, 512, JSON_THROW_ON_ERROR);
            $schemas[$data['@type']] = $data;
        }
        $this->assertEqualsCanonicalizing(['TechArticle', 'BreadcrumbList'], array_keys($schemas));
        $this->assertSame($url, $schemas['TechArticle']['mainEntityOfPage']);
        $this->assertSame('CDN для VLESS XHTTP', $schemas['BreadcrumbList']['itemListElement'][2]['name']);
        $this->assertSame($url, $schemas['BreadcrumbList']['itemListElement'][2]['item']);
    }

    public function test_cdn_setup_metadata_does_not_leak_into_other_routes(): void
    {
        $this->withoutVite();
        $this->get('/guides')->assertOk()->assertDontSee('CDN для VLESS XHTTP: инструкция');
        $this->get('/guides/openflux')->assertOk()->assertDontSee('CDN для VLESS XHTTP: инструкция');
        $this->get('/guides/cdn-selectel')->assertOk()->assertDontSee('CDN для VLESS XHTTP: инструкция');
    }

    public function test_sitemap_includes_cdn_setup_once(): void
    {
        $document = new DOMDocument();
        $document->load(public_path('sitemap.xml'));
        $xpath = new DOMXPath($document);
        $xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $this->assertSame(1, $xpath->query('//s:loc[text()="https://denpiligrim.ru/guides/cdn-setup"]')->length);
    }
}
