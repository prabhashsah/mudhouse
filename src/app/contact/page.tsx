export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-brand-950 mb-6">Contact Us</h1>
          <p className="text-lg text-brand-700">
            Have a question, feedback, or just want to say hi? We’d love to hear from you.
          </p>
        </div>

        <div className="bg-sand p-8 md:p-12 rounded-3xl shadow-lg border border-brand-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-brand-950 mb-2">Get in Touch</h3>
                <p className="text-brand-700 leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours. For immediate assistance during business hours, please call us.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100">
                   <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                   <p className="text-xl font-medium text-brand-900">+1 559-756-0461</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-100">
                   <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mb-1">Email</p>
                   <p className="text-xl font-medium text-brand-900">hello@themudhouse.com</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex gap-4">
                  <span className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer">IG</span>
                  <span className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer">FB</span>
                  <span className="w-12 h-12 rounded-full border border-brand-300 flex items-center justify-center text-brand-800 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer">X</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="bg-white p-8 rounded-2xl shadow-sm border border-brand-100 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-brand-900 font-medium mb-2">Full Name</label>
                  <input type="text" id="name" className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900" placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-brand-900 font-medium mb-2">Email Address</label>
                  <input type="email" id="email" className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900" placeholder="jane@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-brand-900 font-medium mb-2">Your Message</label>
                  <textarea id="message" rows={5} className="w-full bg-sand border border-brand-200 rounded-xl px-4 py-4 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-brand-900 resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
