// Removed unused 'Link' import
import OpsisLogo from './OpsisLogo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-primary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <OpsisLogo size="md" className="mb-4" />
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Opsis AI-powered medical report analysis that's private, instant, and in plain English.
              No account needed. Ever.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-text text-sm mb-4">Product</h4>
            <ul className="flex flex-col gap-2.5">
              {['Features', 'How it works', 'Privacy', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-muted text-sm hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-text text-sm mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Compliance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-muted text-sm hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Updated with Developer Contact */}
        <div className="pt-8 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © 2026 Opsis Health, Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
            <span className="text-xs font-bold text-primary tracking-wide uppercase">Connect Developer:</span>
            <div className="flex items-center gap-4">
              {/* FIXED LINKEDIN URL & TARGET */}
              <a 
                href="https://www.linkedin.com/in/soumya-byabarta-359364381/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-muted hover:text-[#0A66C2] transition-colors text-sm font-medium" 
                aria-label="LinkedIn"
              >
                🔗 LinkedIn
              </a>
              <a 
                href="mailto:byabartasoumya@gmail.com" 
                className="text-text-muted hover:text-primary transition-colors text-sm font-medium" 
                aria-label="Email"
              >
                📧 Email
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted/70 max-w-2xl mx-auto">
          ⚕️ Opsis AI is for informational purposes only and does not constitute medical advice.
          Always consult a qualified healthcare professional for medical decisions.
        </p>
      </div>
    </footer>
  );
}