export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-musicus-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-caption text-musicus-text-secondary">
            <span>Built with</span>
            <svg className="w-4 h-4 text-musicus-accent-primary animate-pulseSubtle" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>for Hackathon 2025</span>
          </div>
          
          <div className="flex items-center gap-6 text-caption text-musicus-text-secondary">
            <a 
              href="https://sepolia.scrollscan.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-musicus-accent-primary transition-colors duration-musicus"
            >
              Explorer
            </a>
            <a 
              href="https://docs.scroll.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-musicus-accent-primary transition-colors duration-musicus"
            >
              Docs
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-musicus-accent-primary transition-colors duration-musicus"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
