# DeFi Dashboard

A comprehensive DeFi dashboard built with Next.js, TypeScript, and shadcn/ui that displays investment pools from DeFiLlama with real-time data, wallet connection, and interactive charts.

## 🚀 Features

### Core Functionality
- **Pool Explorer**: Browse lending pools, liquid staking, and yield aggregator opportunities
- **Real-time Data**: Live APY, TVL, and risk metrics from DeFiLlama API
- **Interactive Charts**: Historical APY visualization with 12-month data
- **Wallet Integration**: Connect crypto wallets using Reown AppKit (formerly WalletConnect)
- **Access Control**: Yield Aggregator pools locked until wallet connection

### User Experience
- **Dual View Modes**: Switch between table and card layouts
- **Category Filtering**: Filter pools by Lending, Liquid Staking, and Yield Aggregator
- **Responsive Design**: Optimized for desktop and mobile devices
- **Professional UI**: Clean, modern interface using shadcn/ui components

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and loading states
- **Performance**: Optimized API calls and data caching
- **Accessibility**: WCAG compliant components

## 📊 Pool Categories

The dashboard features three main investment categories:

### 🏦 Lending
- **Aave V3**: Leading decentralized lending protocol
- **Compound V3**: Institutional-grade lending platform
- **Maple**: Credit-focused lending for institutions

### 💧 Liquid Staking
- **Lido**: Ethereum liquid staking leader
- **Binance Staked ETH**: Exchange-backed staking
- **Stader**: Multi-chain staking protocol

### 🔒 Yield Aggregator (Wallet Required)
- **Cian Yield Layer**: Advanced yield optimization
- **Yearn Finance**: Pioneer in yield farming
- **Beefy**: Multi-chain yield farming

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Web3**: Reown AppKit, Wagmi, Viem
- **API**: DeFiLlama Pools API
- **Data Handling**: Axios, date-fns

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd defi-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Add your WalletConnect Project ID to `.env.local`:
   ```env
   NEXT_PUBLIC_PROJECT_ID="your_project_id_here"
   ```

   Get your Project ID from [Reown Cloud](https://cloud.reown.com)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── pool/[id]/         # Individual pool pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── pools/             # Pool-specific components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Other components
├── config/               # App configuration
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API service layer
└── types/                # TypeScript type definitions
```

## 🔌 API Integration

### DeFiLlama Integration
- **Pools API**: `https://yields.llama.fi/pools`
- **Chart API**: `https://yields.llama.fi/chart/{pool_id}`
- **Data Processing**: Automated filtering and categorization

### Pool Data Structure
```typescript
interface Pool {
  pool: string              // Unique pool ID
  chain: string            // Blockchain network
  project: string          // Protocol name
  symbol: string           // Token symbol
  tvlUsd: number          // Total Value Locked
  apy?: number            // Current APY
  apyMean30d?: number     // 30-day average APY
  prediction?: number     // Future yield estimate
  sigma?: number          // Risk/volatility score
  category?: PoolCategory // Pool classification
}
```

## 🎨 UI Components

### Pool Table
- Sortable columns for all metrics
- Interactive row selection
- Loading skeletons
- Responsive design

### Pool Cards
- Visual card layout alternative
- Touch-friendly for mobile
- Category badges
- Key metrics highlighted

### Charts
- Historical APY line charts
- 12-month data visualization
- Interactive tooltips
- Responsive design

## 🔐 Wallet Integration

### Supported Wallets
- MetaMask
- WalletConnect compatible wallets
- Social login options
- Embedded wallet support

### Access Control
- Yield Aggregator pools locked by default
- Wallet connection unlocks premium features
- Seamless connection flow
- Connection state persistence

## 🧪 Development

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Component documentation
- Error boundaries

### Testing Strategy
- Type safety validation
- Component testing
- API integration testing
- Error handling verification

### Performance Optimization
- Code splitting
- Lazy loading
- API response caching
- Image optimization

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- Docker containers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the assignment requirements

## 🙏 Acknowledgments

- **DeFiLlama**: For providing comprehensive DeFi data
- **Reown**: For wallet connection infrastructure
- **shadcn/ui**: For beautiful, accessible components
- **Next.js Team**: For the amazing framework
