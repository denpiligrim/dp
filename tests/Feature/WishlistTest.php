<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        Schema::create('wishlist', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('occupied')->default(false);
            $table->string('reservation_hash')->nullable();
        });
        DB::table('wishlist')->insert([['name' => 'Книга'], ['name' => 'Наушники']]);
    }

    private function browser(string $character): array
    {
        return ['X-Wishlist-Token' => str_repeat($character, 64)];
    }

    public function test_owner_can_restore_and_change_reservations(): void
    {
        $headers = $this->browser('a');
        $this->putJson('/api/wishlist', ['ids' => [1]], $headers)->assertOk()
            ->assertJsonPath('items.0.mine', true);
        $this->getJson('/api/wishlist', $headers)->assertOk()->assertJsonPath('items.0.mine', true)
            ->assertJsonMissingPath('items.0.reservation_hash');
        $this->putJson('/api/wishlist', ['ids' => [2]], $headers)->assertOk()
            ->assertJsonPath('items.0.occupied', false)->assertJsonPath('items.1.mine', true);
        $this->putJson('/api/wishlist', ['ids' => []], $headers)->assertOk()
            ->assertJsonPath('items.1.occupied', false);
    }

    public function test_conflict_is_atomic_and_other_browser_cannot_release_reservation(): void
    {
        $this->putJson('/api/wishlist', ['ids' => [1]], $this->browser('a'))->assertOk();
        $this->putJson('/api/wishlist', ['ids' => [2]], $this->browser('b'))->assertOk();
        $this->putJson('/api/wishlist', ['ids' => [1]], $this->browser('b'))->assertStatus(409);
        $this->assertTrue((bool) DB::table('wishlist')->where('id', 2)->value('occupied'));
        $this->putJson('/api/wishlist', ['ids' => []], $this->browser('b'))->assertOk();
        $this->getJson('/api/wishlist', $this->browser('b'))->assertJsonPath('items.0.occupied', true)
            ->assertJsonPath('items.0.mine', false);
    }

    public function test_invalid_requests_do_not_change_reservations(): void
    {
        $this->putJson('/api/wishlist', ['ids' => [1]])->assertStatus(422);
        $this->putJson('/api/wishlist', ['ids' => [1, 1]], $this->browser('a'))->assertStatus(422);
        $this->putJson('/api/wishlist', ['ids' => [1, 999]], $this->browser('a'))->assertStatus(409);
        $this->assertEquals(0, DB::table('wishlist')->where('occupied', true)->count());
    }
}
