<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use phpseclib3\Net\SSH2;
use phpseclib3\Crypt\PublicKeyLoader;

class SshController extends Controller
{
    public function installForwarding(Request $request)
    {
        $data = $request->validate([
            'origin_ip' => 'required|ip',
            'intermediate_ip' => 'required|ip',
            'port' => 'required|integer',
            'username' => 'required|string',
            'auth_type' => 'required|in:password,key',
            'auth_value' => 'required|string',
        ]);

        try {
            $ssh = new SSH2($data['intermediate_ip'], $data['port']);

            if ($data['auth_type'] === 'password') {
                if (!$ssh->login($data['username'], $data['auth_value'])) {
                    return response()->json(['error' => 'Login Failed'], 401);
                }
            } else {
                $key = PublicKeyLoader::load($data['auth_value']);
                if (!$ssh->login($data['username'], $key)) {
                    return response()->json(['error' => 'Login Failed'], 401);
                }
            }

            $ssh->setTimeout(300);
            
            $command = "sudo ORIGIN_IP=\"{$data['origin_ip']}\" bash -c \"$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)\"";
            
            if ($data['username'] !== 'root' && $data['auth_type'] === 'password') {
                $command = "echo '{$data['auth_value']}' | sudo -S ORIGIN_IP=\"{$data['origin_ip']}\" bash -c \"$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)\"";
            }

            $output = $ssh->exec($command);

            return response()->json(['output' => $output]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}