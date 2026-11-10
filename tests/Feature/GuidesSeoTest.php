<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class GuidesSeoTest extends TestCase
{
    public function test_catalog_contains_all_guides_and_metadata_without_javascript(): void
    {
        $this->withoutVite();
        $response = $this->get('/guides')->assertOk();
        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);
        $catalog = json_decode(file_get_contents(resource_path('data/guides.json')), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame(1, $xpath->query('//head/title')->length);
        $this->assertSame($catalog['title'], $xpath->evaluate('string(//head/title)'));
        $this->assertSame(1, $xpath->query('//meta[@name="description"]')->length);
        $this->assertSame($catalog['description'], $xpath->evaluate('string(//meta[@name="description"]/@content)'));
        $this->assertSame(1, $xpath->query('//link[@rel="canonical"]')->length);
        $this->assertSame($catalog['url'], $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame($catalog['url'], $xpath->evaluate('string(//meta[@property="og:url"]/@content)'));
        $this->assertSame(1, $xpath->query('//h1')->length);
        $this->assertSame(count($catalog['items']), $xpath->query('//main/article')->length);
        foreach ($catalog['items'] as $guide) {
            $this->assertSame(1, $xpath->query('//main/article/h2/a[@href="'.$guide['to'].'"]')->length);
            $response->assertSee($guide['title']);
        }
        $schemas = [];
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
            $schema = json_decode($script->textContent, true, 512, JSON_THROW_ON_ERROR);
            $schemas[$schema['@type']] = $schema;
        }
        $this->assertEqualsCanonicalizing(['BreadcrumbList', 'ItemList'], array_keys($schemas));
        $this->assertCount(count($catalog['items']), $schemas['ItemList']['itemListElement']);
    }
}
