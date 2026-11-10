<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function assertPageTitleDoesNotContain(string $path, string $text): void
    {
        $response = $this->get($path)->assertOk();
        $document = new \DOMDocument();
        @$document->loadHTML('<?xml encoding="UTF-8">'.$response->getContent());
        $titles = $document->getElementsByTagName('title');
        $this->assertSame(1, $titles->length);
        $this->assertStringNotContainsString($text, $titles->item(0)->textContent);
    }
}
