<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class Zapret2SeoTest extends TestCase
{
    public function test_zapret2_has_metadata_and_useful_content_without_javascript(): void
    {
        $this->withoutVite();
        $response = $this->get('/guides/zapret2')->assertOk();
        $seo = json_decode(file_get_contents(resource_path('data/zapret2-seo.json')), true, 512, JSON_THROW_ON_ERROR);
        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);

        $this->assertSame(1, $xpath->query('//head/title')->length);
        $this->assertSame($seo['title'], $xpath->evaluate('string(//head/title)'));
        $this->assertSame(1, $xpath->query('//meta[@name="description"]')->length);
        $this->assertSame($seo['description'], $xpath->evaluate('string(//meta[@name="description"]/@content)'));
        $this->assertSame(1, $xpath->query('//link[@rel="canonical"]')->length);
        $this->assertSame($seo['url'], $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame('article', $xpath->evaluate('string(//meta[@property="og:type"]/@content)'));
        $this->assertSame($seo['url'], $xpath->evaluate('string(//meta[@property="og:url"]/@content)'));
        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame(1, $xpath->query('//h1')->length);
        $this->assertSame($seo['heading'], $xpath->evaluate('string(//h1)'));
        $this->assertSame(1, $xpath->query('//section[@id="update"]')->length);
        $this->assertSame(1, $xpath->query('//section[@id="uninstall"]')->length);
        $this->assertSame(3, $xpath->query('//a[contains(@rel,"sponsored")]')->length);
        $response->assertSee($seo['videoUrl']);
        $response->assertSee('OpenWrt 22.03+');
        $response->assertSee('Обновление Zapret 2 на OpenWrt');
        $response->assertSee('Удаление Zapret 2 с роутера');
        $response->assertDontSee('macOS');
        foreach (['install', 'update', 'uninstall'] as $action) {
            $url = '/scripts/zapret2/zapret2-'.$action.'.ps1';
            $response->assertSee($url);
            $this->assertFileExists(public_path(ltrim($url, '/')));
        }

        $types = [];
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
            $data = json_decode($script->textContent, true, 512, JSON_THROW_ON_ERROR);
            $types[] = $data['@type'];
        }
        $this->assertEqualsCanonicalizing(['TechArticle', 'BreadcrumbList'], $types);
    }

    public function test_zapret2_is_discoverable_and_does_not_replace_other_metadata(): void
    {
        $this->withoutVite();
        $response = $this->get('/guides')->assertOk();
        $response->assertSee('/guides/zapret2');
        $this->assertPageTitleDoesNotContain('/guides', 'Zapret 2:');
        $this->assertPageTitleDoesNotContain('/', 'Zapret 2:');
        $this->assertPageTitleDoesNotContain('/guides/mieru-proxy', 'Zapret 2:');

        $document = new DOMDocument();
        $document->load(public_path('sitemap.xml'));
        $xpath = new DOMXPath($document);
        $xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');
        $this->assertSame(1, $xpath->query('//s:loc[text()="https://denpiligrim.ru/guides/zapret2"]')->length);
    }
}
