# OpenGPS 🌍

**GPS e navegação open source para Android — sem paywall, sem tracking, sem limites.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Sobre

OpenGPS é um aplicativo de GPS e navegação turn-by-turn gratuito e open source. Inspirado nas melhores características de apps de mapa proprietários, mas sem cobranças, sem assinaturas e sem rastreamento.

## Características

- 🗺️ **Mapas OpenStreetMap** via MapLibre GL (100% open source)
- 🧭 **Navegação turn-by-turn** com instruções de voz
- 📍 **Marcadores personalizados** — salve lugares importantes
- 🔍 **Busca de lugares** via Nominatim (OSM)
- 🚗 **Android Auto** — navegue pelo carro
- 🔗 **Deep links** — abra coordenadas `geo:` de qualquer app
- 📴 **Funciona offline** (cache de tiles)
- 🚫 **Sem paywall** — tudo gratuito
- 🚫 **Sem tracking** — sua privacidade é respeitada
- 📱 **MIT License** — use, modifique, distribua livremente

## Tecnologias

| Componente | Tecnologia |
|---|---|
| Framework | React Native + Expo |
| Mapas | MapLibre GL + OpenStreetMap |
| Roteamento | OSRM (open source) |
| Busca | Nominatim (OpenStreetMap) |
| UI | React Native Paper |
| Localização | expo-location |
| Android Auto | Android Auto App Library |

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/opengps.git
cd opengps

# Instalar dependências
npm install

# Iniciar em desenvolvimento
npx expo start

# Build para Android
npx expo run:android
# ou via EAS
npx eas-cli build --platform android
```

## Estrutura do Projeto

```
opengps/
├── App.tsx                 # Entry point
├── src/
│   ├── components/         # Componentes UI
│   │   ├── MapView.tsx     # Visualização do mapa
│   │   ├── SearchBar.tsx   # Barra de busca
│   │   └── NavigationBanner.tsx  # Banner de navegação
│   ├── screens/            # Telas
│   │   └── MapScreen.tsx   # Tela principal do mapa
│   ├── services/           # Serviços
│   │   ├── LocationService.ts    # GPS e localização
│   │   ├── RoutingService.ts     # Cálculo de rotas
│   │   └── SearchService.ts      # Busca de lugares
│   ├── hooks/              # React Hooks
│   │   ├── useLocation.ts  # Hook de localização
│   │   └── useNavigation.ts # Hook de navegação
│   ├── types/              # Definições TypeScript
│   └── constants/          # Configurações
├── app.json                # Configuração Expo
└── LICENSE                 # MIT License
```

## Permissões Android

O app solicita apenas as permissões necessárias:

- **Localização** — mostrar sua posição no mapa e navegar
- **Internet** — buscar mapas, rotas e lugares
- **Serviços em foreground** — navegação contínua
- **Acordar tela** — manter o mapa ativo durante navegação

## Privacidade

- ✅ Nenhum dado é enviado para servidores proprietários
- ✅ Nenhum rastreamento de analytics ou publicidade
- ✅ Localização processada apenas no dispositivo
- ✅ Mapas e rotas de serviços públicos open source
- ✅ Código 100% auditável

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2026 OpenGPS Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
