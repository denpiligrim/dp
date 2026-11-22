<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class SelfStealSeoTest extends TestCase
{
    public function test_guide_is_discoverable_and_has_content_before_javascript(): void
    {
        $this->withoutVite();
        $seo = json_decode(file_get_contents(resource_path('data/self-steal-seo.json')), true, 512, JSON_THROW_ON_ERROR);
        $response = $this->get('/guides/self-steal')->assertOk();
        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);

        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame($seo['title'], $xpath->evaluate('string(//head/title)'));
        $this->assertSame($seo['url'], $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame($seo['heading'], $xpath->evaluate('string(//main/h1)'));
        $this->assertSame(count($seo['steps']), $xpath->query('//main/ol/li')->length);
        $this->get('/guides')->assertOk()->assertSee('href="/guides/self-steal"', false);
        $this->assertSame(1, substr_count(file_get_contents(public_path('sitemap.xml')), '<loc>'.$seo['url'].'</loc>'));
    }
}
