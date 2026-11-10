<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class OpenFluxSeoTest extends TestCase
{
    public function test_openflux_has_unique_metadata_and_content_without_javascript(): void
    {
        $this->withoutVite();
        $response = $this->get('/guides/openflux');
        $response->assertOk();

        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);

        $this->assertSame(1, $xpath->query('//head/title')->length);
        $this->assertStringContainsString('OpenFlux', $xpath->evaluate('string(//head/title)'));
        $this->assertSame(1, $xpath->query('//meta[@name="description"]')->length);
        $this->assertSame(1, $xpath->query('//link[@rel="canonical"]')->length);
        $this->assertSame('https://denpiligrim.ru/guides/openflux', $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame('article', $xpath->evaluate('string(//meta[@property="og:type"]/@content)'));
        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame(1, $xpath->query('//h1')->length);
        $this->assertStringContainsString('OpenFlux', $xpath->evaluate('string(//h1)'));
        $this->assertSame(4, $xpath->query('//main/h3')->length);

        $types = [];
        foreach ($xpath->query('//script[@type="application/ld+json"]') as $script) {
            $data = json_decode($script->textContent, true, 512, JSON_THROW_ON_ERROR);
            $types[] = $data['@type'];
        }
        $this->assertEqualsCanonicalizing(['TechArticle', 'BreadcrumbList'], $types);
    }

    public function test_openflux_metadata_does_not_leak_into_other_server_routes(): void
    {
        $this->withoutVite();
        $this->assertPageTitleDoesNotContain('/guides', 'OpenFlux: инструкция');
    }
}
