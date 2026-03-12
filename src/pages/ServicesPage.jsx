import { useState } from 'react';
import { 
  Heart, 
  Brain, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ShoppingCart,
  Star
} from 'lucide-react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ServicesPage = () => {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  const services = [
    {
      id: 'service-mental-health',
      title: 'Mental Health Consultation',
      description: 'Professional 1-on-1 counseling sessions with licensed therapists specializing in chronic illness management, anxiety, and wellness.',
      price: 1500,
      icon: Brain,
      color: 'bg-purple-50 text-purple-600',
      tag: 'Healthcare',
      features: [
        '60-minute private session',
        'Certified clinical psychologists',
        'Personalized coping strategies',
        'Digital wellness resources included'
      ],
      rating: 4.9,
      reviews: 124
    },
    {
      id: 'service-diabetes-education',
      title: 'Diabetes Education Program',
      description: 'Comprehensive educational sessions covering CGM usage, nutrition planning, and lifestyle adjustments for better glucose control.',
      price: 1200,
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-600',
      tag: 'Education',
      features: [
        'Step-by-step device training',
        'Customized nutrition roadmap',
        'Interactive Q&A sessions',
        'Lifetime access to study materials'
      ],
      rating: 4.8,
      reviews: 89
    },
    {
      id: 'service-career-guidance',
      title: 'Career Guidance (Healthcare)',
      description: 'Expert mentorship for students and professionals looking to build a successful career in the medical and pharmaceutical sectors.',
      price: 2000,
      icon: ShieldCheck,
      color: 'bg-green-50 text-green-600',
      tag: 'Career',
      features: [
        'Profile & Resume evaluation',
        'Industry networking tips',
        'Mock interview preparation',
        'Global career opportunities'
      ],
      rating: 5.0,
      reviews: 56
    }
  ];

  const handleAddToCart = (service) => {
    setAddingId(service.id);
    addToCart({
      id: service.id,
      name: service.title,
      price: service.price,
      image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=400', // Generic medical service image
      category: 'Services',
      quantity: 1,
      stock: 100 // Services are effectively always in stock
    });
    
    setTimeout(() => {
      setAddingId(null);
      toast.success(`${service.title} added to consultations!`);
    }, 500);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-border py-16">
        <div className="container-main text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Expert Consultations
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-text-primary mb-6">
            Professional Services for <span className="text-primary">Your Growth</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Beyond products, we provide the expertise you need. From specialized medical education to mental wellness and career coaching.
          </p>
        </div>
      </section>

      <div className="container-main mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-3xl border border-border overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-8 pb-0">
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon size={28} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center text-warning">
                    <Star size={14} className="fill-warning" />
                    <span className="ml-1 text-xs font-bold text-text-primary">{service.rating}</span>
                  </div>
                  <span className="text-xs text-text-secondary">({service.reviews} reviews)</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto p-8 pt-0">
                <div className="flex items-center justify-between py-6 border-t border-border mb-6">
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Starting at</p>
                    <p className="text-2xl font-black text-text-primary">
                      ₹{service.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium bg-gray-100 px-3 py-1 rounded-full text-text-secondary">
                    <Clock size={12} /> Flexible Timing
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(service)}
                  disabled={addingId === service.id}
                >
                  {addingId === service.id ? (
                    'Adding to Cart...'
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Book This Service
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <section className="mt-24 bg-primary rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Book Our Professional Services?</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                We bridge the gap between medical supplies and professional guidance. Our experts are vetted and specialized in their respective fields.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-white">
                    <ShieldCheck size={18} /> Verified Experts
                  </h4>
                  <p className="text-sm text-white/70">All practitioners are certified and go through a rigorous background check.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-white">
                    <Clock size={18} /> Instant Booking
                  </h4>
                  <p className="text-sm text-white/70">Simple, hassle-free checkout and scheduling that fits your timeline.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl rotate-3">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" 
                  alt="Professional consultation" 
                  className="rounded-[2rem] w-full max-w-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section Shortcut */}
        <div className="mt-20 text-center">
          <h3 className="text-xl font-bold text-text-primary mb-4">Have questions about our sessions?</h3>
          <Button variant="secondary" href="/contact" iconRight={ArrowRight}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
