import { MapPin, Clock, Check, X, Navigation, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function StorePage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-950 mb-6">Visit Our Store</h1>
          <p className="text-xl text-brand-700">We look forward to welcoming you.</p>
        </div>

        <div className="bg-sand rounded-3xl overflow-hidden shadow-xl border border-brand-200">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Store Information */}
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <div className="space-y-8">
                
                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-800 shrink-0 shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-950 mb-1">Location</h3>
                    <p className="text-brand-700 text-lg">34 E Garden Ave<br/>Porterville, CA 93257</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-800 shrink-0 shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-950 mb-1">Hours</h3>
                    <p className="text-brand-700 text-lg">Mon - Sun: Open - Closes at 6:00 PM</p>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-6 border-t border-brand-200">
                   <h3 className="text-lg font-bold text-brand-950 mb-4">Services Available:</h3>
                   <ul className="space-y-3">
                     <li className="flex items-center text-brand-800 font-medium"><Check size={20} className="mr-3 text-green-600" /> Dine-in</li>
                     <li className="flex items-center text-brand-800 font-medium"><Check size={20} className="mr-3 text-green-600" /> Takeaway</li>
                     <li className="flex items-center text-brand-500"><X size={20} className="mr-3 text-red-500" /> Delivery (Currently Unavailable)</li>
                   </ul>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link 
                    href="https://maps.google.com" 
                    target="_blank"
                    className="flex items-center justify-center bg-brand-800 hover:bg-brand-900 text-white font-bold py-4 rounded-xl transition-all flex-1 shadow-md hover:shadow-lg"
                  >
                    <Navigation size={20} className="mr-2" /> Get Directions
                  </Link>
                  <Link 
                    href="tel:+15597560461" 
                    className="flex items-center justify-center bg-white border-2 border-brand-800 text-brand-900 hover:bg-brand-50 font-bold py-4 rounded-xl transition-colors flex-1"
                  >
                    <PhoneCall size={20} className="mr-2" /> Call Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative min-h-[400px] lg:min-h-full bg-brand-200">
              {/* This simulates a map embed without using unpredictable iframes */}
              <div className="absolute inset-0 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] bg-brand-100">
                 <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-brand-200 z-10 animate-bounce">
                    <MapPin size={48} className="text-brand-600 mx-auto mb-2" />
                    <p className="font-bold text-brand-950 text-xl">The Mud House</p>
                    <p className="text-sm text-brand-600">34 E Garden Ave</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
