import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Eye, Tag } from 'lucide-react';

// Supabase Client
const supabase = createClient(
  'https://xjfbizrqcxknlleuqzqc.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZmJpenJxY3hrbmxsZXVxenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MDEyNTAsImV4cCI6MjA5OTI3NzI1MH0._5vtNqsCvSsMytcuowGVLgoABDTLbCEUy91j8RGvTwk'
);

export default function LivestockShop() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('livestock').select('*');
      if (error) console.error("Error fetching data:", error);
      if (data) setProducts(data);
    }
    fetchData();
  }, []);

  return (
    <section className="py-20 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">আমাদের খামারের পশু</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {products.map((cow: any) => (
            <div key={cow.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <img 
                src={cow.image_url || 'https://via.placeholder.com/300'} 
                alt={cow.title} 
                className="w-full h-48 object-cover rounded-xl" 
              />
              <h3 className="font-bold text-lg mt-4 text-gray-800">{cow.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600 font-medium">দাম:</span>
                <span className="text-[#0A5C36] font-bold text-lg">৳ {cow.price}</span>
              </div>
              <button className="w-full bg-[#0A5C36] hover:bg-[#063D24] text-white py-3 mt-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Eye className="w-4 h-4" /> View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
