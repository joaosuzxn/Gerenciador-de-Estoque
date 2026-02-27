<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;
use Faker\Factory as Faker;

class ProdutoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('pt_BR');

        $produtosEletronicos = [
            ['nome' => 'Notebook Dell Inspiron 15', 'descricao' => 'Notebook com processador Intel Core i5, 8GB RAM, SSD 256GB, tela Full HD 15.6 polegadas. Ideal para trabalho e estudos.'],
            ['nome' => 'Smartphone Samsung Galaxy S23', 'descricao' => 'Smartphone Android com tela AMOLED de 6.1 polegadas, câmera tripla de 50MP, 128GB de armazenamento e bateria de longa duração.'],
            ['nome' => 'Tablet iPad Air', 'descricao' => 'Tablet Apple com chip M1, tela Retina de 10.9 polegadas, 64GB de armazenamento. Perfeito para produtividade e entretenimento.'],
            ['nome' => 'Mouse Logitech MX Master 3', 'descricao' => 'Mouse sem fio ergonômico com sensor de alta precisão, bateria recarregável e múltiplos botões programáveis.'],
            ['nome' => 'Teclado Mecânico RGB', 'descricao' => 'Teclado mecânico com switches Cherry MX, iluminação RGB personalizável e construção em alumínio.'],
            ['nome' => 'Monitor LG UltraWide 29"', 'descricao' => 'Monitor ultrawide IPS de 29 polegadas, resolução 2560x1080, ideal para multitarefa e produtividade.'],
            ['nome' => 'Headset HyperX Cloud II', 'descricao' => 'Headset gamer com som surround 7.1, microfone removível com cancelamento de ruído e construção durável.'],
            ['nome' => 'Webcam Logitech C920', 'descricao' => 'Webcam Full HD 1080p com microfone estéreo integrado, ideal para videoconferências e transmissões.'],
            ['nome' => 'Impressora HP LaserJet', 'descricao' => 'Impressora laser monocromática, impressão rápida e econômica, ideal para escritório.'],
            ['nome' => 'SSD Samsung 1TB', 'descricao' => 'SSD interno de 1TB, velocidade de leitura até 3500MB/s, ideal para melhorar performance do computador.'],
            ['nome' => 'Memória RAM DDR4 16GB', 'descricao' => 'Kit de memória RAM DDR4 de 16GB (2x8GB), frequência 3200MHz, compatível com Intel e AMD.'],
            ['nome' => 'Processador Intel Core i7', 'descricao' => 'Processador Intel Core i7 de 12ª geração, 8 núcleos, 16 threads, ideal para jogos e edição de vídeo.'],
            ['nome' => 'Placa de Vídeo RTX 4060', 'descricao' => 'Placa de vídeo NVIDIA RTX 4060 com 8GB GDDR6, ray tracing e DLSS 3.0 para jogos em alta qualidade.'],
            ['nome' => 'Roteador WiFi 6 TP-Link', 'descricao' => 'Roteador WiFi 6 dual-band, velocidade até 1800Mbps, cobertura ampla e múltiplos dispositivos simultâneos.'],
            ['nome' => 'Smart TV Samsung 55"', 'descricao' => 'Smart TV LED 55 polegadas 4K UHD, sistema Tizen, HDR e compatível com streaming.'],
            ['nome' => 'PlayStation 5', 'descricao' => 'Console de videogame PlayStation 5 com SSD ultra-rápido, ray tracing e compatibilidade com PS4.'],
            ['nome' => 'Xbox Series X', 'descricao' => 'Console Xbox Series X com 1TB de armazenamento, 4K a 60fps e compatibilidade retroativa.'],
            ['nome' => 'Fone de Ouvido AirPods Pro', 'descricao' => 'Fones de ouvido sem fio Apple com cancelamento ativo de ruído, áudio espacial e resistência à água.'],
            ['nome' => 'Caixa de Som JBL Charge 5', 'descricao' => 'Caixa de som Bluetooth portátil com bateria de 20h, à prova d\'água e som estéreo potente.'],
            ['nome' => 'Smartwatch Apple Watch Series 9', 'descricao' => 'Relógio inteligente com GPS, monitoramento de saúde, resistente à água e tela sempre ligada.'],
            ['nome' => 'Câmera Canon EOS R6', 'descricao' => 'Câmera mirrorless full-frame, 20MP, gravação 4K, estabilização de imagem e foco automático avançado.'],
            ['nome' => 'Action Cam GoPro Hero 12', 'descricao' => 'Câmera de ação 4K, à prova d\'água, estabilização HyperSmooth e bateria de longa duração.'],
            ['nome' => 'Projetor Epson Full HD', 'descricao' => 'Projetor Full HD 1080p, 3500 lúmens, ideal para home theater e apresentações.'],
            ['nome' => 'Hub USB-C 7 em 1', 'descricao' => 'Hub USB-C com múltiplas portas: HDMI, USB 3.0, leitor de cartão SD, carregamento PD e Ethernet.'],
            ['nome' => 'Power Bank 20000mAh', 'descricao' => 'Carregador portátil de 20000mAh com carregamento rápido, múltiplas portas USB e indicador LED.'],
            ['nome' => 'Dock Station USB-C', 'descricao' => 'Dock station USB-C com HDMI 4K, múltiplas portas USB, Ethernet e carregamento para notebook.'],
            ['nome' => 'Mousepad Gamer RGB', 'descricao' => 'Mousepad gamer com iluminação RGB, superfície de tecido de alta qualidade e bordas costuradas.'],
            ['nome' => 'Monitor Curvo Samsung 32"', 'descricao' => 'Monitor curvo VA de 32 polegadas, 144Hz, FreeSync, ideal para jogos e trabalho.'],
            ['nome' => 'Placa Mãe ASUS B550', 'descricao' => 'Placa mãe AMD B550, suporte PCIe 4.0, WiFi 6 integrado e RGB personalizável.'],
            ['nome' => 'Fonte Corsair 750W', 'descricao' => 'Fonte de alimentação 750W 80 Plus Gold, modular, ideal para builds de alto desempenho.'],
            ['nome' => 'Cooler Master Hyper 212', 'descricao' => 'Cooler para processador com dissipador de calor, ventilador silencioso e fácil instalação.'],
            ['nome' => 'Gabinete NZXT H510', 'descricao' => 'Gabinete ATX com painel lateral em vidro temperado, gerenciamento de cabos e ventiladores incluídos.'],
            ['nome' => 'Microfone Blue Yeti', 'descricao' => 'Microfone USB condensador com múltiplos padrões de captação, ideal para streaming e gravação.'],
            ['nome' => 'Interface de Áudio Focusrite', 'descricao' => 'Interface de áudio USB com 2 entradas XLR, pré-amplificadores de qualidade profissional.'],
            ['nome' => 'Mixer de Áudio Behringer', 'descricao' => 'Mixer de áudio analógico com 12 canais, equalizador 3 bandas e efeitos integrados.'],
            ['nome' => 'Amplificador Yamaha', 'descricao' => 'Amplificador estéreo de 100W por canal, múltiplas entradas e controle remoto.'],
            ['nome' => 'Subwoofer Klipsch 12"', 'descricao' => 'Subwoofer ativo de 12 polegadas, 400W RMS, ideal para home theater e música.'],
            ['nome' => 'NAS Synology 4 Bays', 'descricao' => 'Servidor de armazenamento em rede com 4 bays, RAID e acesso remoto.'],
            ['nome' => 'Switch de Rede 24 Portas', 'descricao' => 'Switch gerenciável de 24 portas Gigabit, ideal para redes empresariais.'],
            ['nome' => 'Firewall Fortinet', 'descricao' => 'Firewall de próxima geração com proteção avançada contra ameaças e VPN integrada.'],
            ['nome' => 'Workstation Dell Precision', 'descricao' => 'Workstation profissional com processador Xeon, placa de vídeo Quadro e ECC RAM.'],
            ['nome' => 'Notebook Gamer ASUS ROG', 'descricao' => 'Notebook gamer com RTX 4070, Intel Core i9, 32GB RAM, SSD 1TB e tela 240Hz.'],
            ['nome' => 'Smartphone iPhone 15 Pro', 'descricao' => 'iPhone 15 Pro com chip A17 Pro, câmera de 48MP, tela Super Retina XDR e bateria de longa duração.'],
            ['nome' => 'Tablet Samsung Galaxy Tab S9', 'descricao' => 'Tablet Android com tela AMOLED de 11 polegadas, S Pen incluído e processador Snapdragon 8 Gen 2.'],
            ['nome' => 'Mouse Gamer Razer DeathAdder', 'descricao' => 'Mouse gamer com sensor óptico de 20.000 DPI, iluminação RGB Chroma e 8 botões programáveis.'],
            ['nome' => 'Teclado Gamer Corsair K70', 'descricao' => 'Teclado mecânico gamer com switches Cherry MX, iluminação RGB por tecla e teclas macro dedicadas.'],
            ['nome' => 'Monitor ASUS ROG 27" 4K', 'descricao' => 'Monitor gamer 4K de 27 polegadas, 144Hz, G-Sync e HDR para jogos em alta qualidade.'],
            ['nome' => 'Headset SteelSeries Arctis 7', 'descricao' => 'Headset sem fio gamer com áudio surround, bateria de 24h e microfone retrátil com cancelamento de ruído.'],
            ['nome' => 'Webcam Razer Kiyo Pro', 'descricao' => 'Webcam 1080p com iluminação ring LED integrada, ajuste automático de exposição e microfone estéreo.'],
            ['nome' => 'Impressora Epson EcoTank', 'descricao' => 'Impressora jato de tinta com sistema de tanque de tinta, impressão econômica e alta capacidade.'],
            ['nome' => 'SSD NVMe WD Black 2TB', 'descricao' => 'SSD NVMe PCIe 4.0 de 2TB, velocidade de leitura até 7300MB/s, ideal para gamers e profissionais.'],
            ['nome' => 'Memória RAM DDR5 32GB', 'descricao' => 'Kit de memória RAM DDR5 de 32GB (2x16GB), frequência 6000MHz, RGB personalizável.'],
            ['nome' => 'Processador AMD Ryzen 9 7900X', 'descricao' => 'Processador AMD Ryzen 9 de 12 núcleos, 24 threads, ideal para edição de vídeo e streaming.'],
            ['nome' => 'Placa de Vídeo RTX 4080', 'descricao' => 'Placa de vídeo NVIDIA RTX 4080 com 16GB GDDR6X, ray tracing e DLSS 3.0 para 4K gaming.'],
            ['nome' => 'Roteador WiFi 6E ASUS', 'descricao' => 'Roteador WiFi 6E tri-band, velocidade até 11000Mbps, mesh compatível e gerenciamento via app.'],
            ['nome' => 'Smart TV LG OLED 65"', 'descricao' => 'Smart TV OLED 65 polegadas 4K, sistema webOS, Dolby Vision IQ e som Dolby Atmos integrado.'],
            ['nome' => 'Nintendo Switch OLED', 'descricao' => 'Console Nintendo Switch com tela OLED de 7 polegadas, melhor bateria e som aprimorado.'],
            ['nome' => 'Fone de Ouvido Sony WH-1000XM5', 'descricao' => 'Fones de ouvido over-ear com cancelamento de ruído líder, bateria de 30h e som Hi-Res.'],
            ['nome' => 'Caixa de Som Sonos Beam', 'descricao' => 'Soundbar inteligente com assistente de voz, Dolby Atmos e compatível com streaming de música.'],
            ['nome' => 'Smartwatch Samsung Galaxy Watch 6', 'descricao' => 'Relógio inteligente com tela AMOLED, monitoramento de saúde avançado, GPS e bateria de 40h.'],
        ];

        foreach ($produtosEletronicos as $produto) {
            Produto::create([
                'nome' => $produto['nome'],
                'descricao' => $produto['descricao'],
                'preco' => $faker->randomFloat(2, 50.00, 15000.00),
                'quantidade' => $faker->numberBetween(0, 200),
            ]);
        }
    }
}
