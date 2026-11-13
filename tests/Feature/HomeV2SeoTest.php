<?php

namespace Tests\Feature;

use DOMDocument;
use DOMXPath;
use Tests\TestCase;

class HomeV2SeoTest extends TestCase
{
    public function test_home_version_has_metadata_and_useful_content_without_javascript(): void
    {
        $this->withoutVite();
        $response = $this->get('/home-v2')->assertOk();
        $seo = json_decode(file_get_contents(resource_path('data/home-v2-seo.json')), true, 512, JSON_THROW_ON_ERROR);
        $document = new DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $xpath = new DOMXPath($document);

        $this->assertSame('ru', $xpath->evaluate('string(/html/@lang)'));
        $this->assertSame(1, $xpath->query('//head/title')->length);
        $this->assertSame($seo['title'], $xpath->evaluate('string(//head/title)'));
        $this->assertSame(1, $xpath->query('//meta[@name="description"]')->length);
        $this->assertSame($seo['description'], $xpath->evaluate('string(//meta[@name="description"]/@content)'));
        $this->assertSame(1, $xpath->query('//meta[@name="robots"]')->length);
        $this->assertSame('index, follow', $xpath->evaluate('string(//meta[@name="robots"]/@content)'));
        $this->assertSame(1, $xpath->query('//link[@rel="canonical"]')->length);
        $this->assertSame($seo['url'], $xpath->evaluate('string(//link[@rel="canonical"]/@href)'));
        $this->assertSame($seo['url'], $xpath->evaluate('string(//meta[@property="og:url"]/@content)'));
        $this->assertSame($seo['title'], $xpath->evaluate('string(//meta[@property="og:title"]/@content)'));
        $this->assertSame($seo['description'], $xpath->evaluate('string(//meta[@property="og:description"]/@content)'));
        $this->assertSame('summary_large_image', $xpath->evaluate('string(//meta[@name="twitter:card"]/@content)'));
        $this->assertSame($seo['image'], $xpath->evaluate('string(//meta[@property="og:image"]/@content)'));
        $this->assertSame($seo['image'], $xpath->evaluate('string(//meta[@name="twitter:image"]/@content)'));
        $shareImage = public_path(ltrim(parse_url($seo['image'], PHP_URL_PATH), '/'));
        $this->assertFileExists($shareImage);
        $this->assertSame([1200, 630], array_slice(getimagesize($shareImage), 0, 2));
        $this->assertSame(1, $xpath->query('//h1')->length);
        $this->assertSame($seo['heading'], $xpath->evaluate('string(//h1)'));
        $response->assertSee($seo['intro']);

        foreach (array_merge($seo['topics'], $seo['guides']) as $item) {
            $this->assertSame(1, $xpath->query('//main//a[@href="'.$item['to'].'"]')->length);
            $response->assertSee($item['title']);
        }
        foreach ($seo['socials'] as $url) {
            $this->assertSame(1, $xpath->query('//main//a[@href="'.$url.'"]')->length);
        }

        $scripts = $xpath->query('//script[@type="application/ld+json"]');
        $this->assertSame(1, $scripts->length);
        $schema = json_decode($scripts->item(0)->textContent, true, 512, JSON_THROW_ON_ERROR);
        $this->assertSame($seo['schema'], $schema);
        $nodes = array_column($schema['@graph'], null, '@type');
        $this->assertEqualsCanonicalizing(['Person', 'WebSite', 'WebPage'], array_keys($nodes));
        $this->assertEqualsCanonicalizing(array_values($seo['socials']), $nodes['Person']['sameAs']);
        $this->assertSame($seo['url'], $nodes['WebPage']['url']);
        $this->assertSame($nodes['Person']['@id'], $nodes['WebPage']['author']['@id']);
        $this->assertSame($nodes['WebSite']['@id'], $nodes['WebPage']['isPartOf']['@id']);
    }
}
