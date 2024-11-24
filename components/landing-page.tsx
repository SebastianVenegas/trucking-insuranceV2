'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AwardIcon, BuildingIcon, CheckIcon, ClockIcon, DollarSignIcon, FacebookIcon, FileTextIcon, GlobeIcon, HeadphonesIcon, InstagramIcon, MailIcon, MenuIcon, PhoneIcon, ShieldCheckIcon, SparklesIcon, StarIcon, TargetIcon, TruckIcon, TwitterIcon, UserIcon } from 'lucide-react'
import TawkToWidget from '@/components/TawkToWidget'
import { toast, Toaster } from 'react-hot-toast';

// Types and constants
type Language = 'en' | 'es'

type Service = {
  title: Record<Language, string>
  description: Record<Language, string>
  icon: JSX.Element
  color: string
  features: string[]
}

const heroBanners = [
  {
    title: { 
      en: "Drive Your Business Forward with Confidence",
      es: "Impulsa tu Negocio con Confianza"
    },
    subtitle: {
      en: "Comprehensive insurance solutions tailored for truckers",
      es: "Soluciones de seguro integrales diseñadas para camioneros"
    },
    cta: {
      en: "Get Your Free Quote",
      es: "Obtén tu Cotización Gratuita"
    }
  },
  {
    title: {
      en: "Expert Guidance, 24/7 Support",
      es: "Orientación Experta, Soporte 24/7"
    },
    subtitle: {
      en: "We're here for you around the clock, ensuring your peace of mind",
      es: "Estamos aquí para ti las 24 horas, garantizando tu tranquilidad"
    },
    cta: {
      en: "Schedule a Consultation",
      es: "Agenda una Consulta"
    }
  },
  {
    title: {
      en: "Maximize Savings, Minimize Risks",
      es: "Maximiza el Ahorro, Minimiza los Riesgos"
    },
    subtitle: {
      en: "Unbeatable rates and comprehensive coverage for your trucking business",
      es: "Tarifas inmejorables y cobertura integral para tu negocio de transporte"
    },
    cta: {
      en: "Explore Our Services",
      es: "Explora Nuestros Servicios"
    }
  }
]

const heroImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/openart-image_vWJBE_EO_1731344877580_raw.jpg-tny9EGsCvJbrJXUQ7baqvUWZLyeu6h.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/openart-image_VJWXuckm_1731344877635_raw.jpg-y5ReEPNeeW0iKaczjbNAELtOdwHDRo.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/openart-image_ubf4h2G-_1731344878089_raw.jpg-hsvWrnbpcjcwB94k3CXJhPPu7hDqLJ.jpeg"
]

const services: { insurance: Service[], additional: Service[] } = {
  insurance: [
    {
      title: { en: "Commercial Auto Liability", es: "Responsabilidad de Auto Comercial" },
      description: { 
        en: "Comprehensive coverage tailored to your trucking operations, ensuring compliance and peace of mind.", 
        es: "Cobertura integral adaptada a tus operaciones de transporte, asegurando cumplimiento y tranquilidad." 
      },
      icon: <ShieldCheckIcon className="h-10 w-10 text-blue-600" />,
      color: "bg-blue-100", 
      features: [
        "Coverage for bodily injury and property damage",
        "Flexible limits for specific business needs",
        "24/7 claims support",
        "Legal defense for accidents"
      ]
    },
    {
      title: { en: "Physical Damage Coverage", es: "Cobertura de Daos Físicos" },
      description: { 
        en: "Protect your fleet with collision and comprehensive coverage for your trucks and equipment.", 
        es: "Protege tu flota con cobertura de colisión y amplia para tus camiones y equipos." 
      },
      icon: <TruckIcon className="h-10 w-10 text-green-600" />,
      color: "bg-green-100",
      features: [
        "Collision coverage",
        "Comprehensive coverage",
        "Custom equipment protection",
        "Towing and labor costs"
      ]
    },
    {
      title: { en: "Cargo Insurance", es: "Seguro de Carga" },
      description: { 
        en: "Secure your freight with comprehensive coverage for goods in transit.", 
        es: "Asegura tu carga con cobertura integral para mercancías en tránsito." 
      },
      icon: <BuildingIcon className="h-10 w-10 text-yellow-600" />,
      color: "bg-yellow-100",
      features: [
        "All-risk coverage",
        "Refrigerated cargo protection",
        "Broad form coverage available",
        "Expedited claims process"
      ]
    },
    // Add more insurance services as needed
  ],
  additional: [
    {
      title: { en: "DOT Compliance Assistance", es: "Asistencia en Cumplimiento DOT" },
      description: { 
        en: "Navigate complex DOT regulations with expert guidance and support.", 
        es: "Navega las complejas regulaciones del DOT con orientación y apoyo experto." 
      },
      icon: <CheckIcon className="h-10 w-10 text-blue-600" />,
      color: "bg-blue-100",
      features: [
        "DOT audit preparation",
        "Driver qualification file management",
        "Hours of Service (HOS) compliance",
        "Drug and alcohol testing program"
      ]
    },
    {
      title: { en: "Permits and Licensing", es: "Permisos y Licencias" },
      description: { 
        en: "Streamline your licensing and permitting processes with our expert assistance.", 
        es: "Agiliza tus procesos de licencias y permisos con nuestra asistencia experta." 
      },
      icon: <FileTextIcon className="h-10 w-10 text-green-600" />,
      color: "bg-green-100",
      features: [
        "USDOT number registration",
        "MC number acquisition",
        "State-specific permit assistance",
        "IFTA and IRP registration"
      ]
    },
    // Add more additional services as needed
  ]
};

// Reusable components
const ServiceCard = ({ service, language, scrollToSection }: { service: Service, language: Language, scrollToSection: (sectionId: string) => void }) => (
  <Card className={`hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 ${service.color}`}>
    <CardContent className="p-4 sm:p-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center">
              {service.icon}
              <h3 className="text-lg sm:text-xl font-semibold ml-3">{service.title[language]}</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-gray-600 mb-4">{service.description[language]}</p>
            <ul className="list-disc pl-5 mb-4">
              {service.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-gray-600">{feature}</li>
              ))}
            </ul>
            <div className="flex justify-center">
              <Button
                size="sm"
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {language === 'es' ? 'Obtén una Cotización' : 'Get a Quote'}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
)

export function LandingPage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [language, setLanguage] = useState<Language>('en')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % heroBanners.length)
    }, 8000) // Slower rotation

    return () => clearInterval(timer)
  }, [])

  const toggleLanguage = () => {
    setLanguage((prev: Language) => prev === 'es' ? 'en' : 'es')
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
        }),
      });

      if (response.ok) {
        toast.success('Thank you for your message! We will get back to you soon.', {
          duration: 4000,
          style: {
            background: '#2563eb',
            color: '#ffffff',
          },
        });
        setContactForm({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Something went wrong. Please try again or contact us directly.', {
          duration: 4000,
          style: {
            background: '#dc2626',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Unable to send message. Please try again later.', {
        duration: 4000,
        style: {
          background: '#dc2626',
          color: '#ffffff',
        },
      });
    }
  };

  const texts = {
    es: {
      nav: {
        title: "Raquel Martinez Insurance & Trucking Solutions",
        language: "English",
        menu: {
          services: "Servicios",
          about: "Sobre Mí",
          testimonials: "Testimonios",
          contact: "Contacto"
        }
      },
      whyChooseMe: {
        title: "¿Por Qué Elegirme como Tu Agente de Seguros y Especialista en Transporte?",
        reasons: [
          {
            title: "Experiencia Incomparable",
            description: "Con más de 25 años en la industria, entiendo profundamente las necesidades únicas de los camioneros como tú.",
            icon: <AwardIcon className="h-12 w-12 text-yellow-500" />
          },
          {
            title: "Ahorros Significativos",
            description: "Mis relaciones con las principales aseguradoras te garantizan las mejores tarifas personalizadas para tu negocio.",
            icon: <DollarSignIcon className="h-12 w-12 text-green-500" />
          },
          {
            title: "Servicio Personalizado",
            description: "Ofrezco atención enfocada, asegurando que tus necesidades específicas se atiendan con cuidado y precisión.",
            icon: <UserIcon className="h-12 w-12 text-blue-500" />
          },
          {
            title: "Soporte Disponible en Todo Momento",
            description: "Asistencia confiable siempre que la necesites, brindándote total tranquilidad.",
            icon: <HeadphonesIcon className="h-12 w-12 text-purple-500" />
          }
        ]
      },
      services: {
        title: "Servicios Personalizados para Tu Éxito",
        subtitle: "Soluciones integrales diseñadas para tu negocio único, ofreciendo la mejor calidad al precio más competitivo",
        insurance: "Productos de Seguro",
        additional: "Servicios Adicionales",
        cta: "Obtén una Cotización Personalizada",
        askRaquel: "Pregunta a Raquel"
      },
      about: {
        title: {
          en: "Raquel Martinez: Your Trusted Insurance Agent and Transportation Specialist",
          es: "Raquel Martinez: Tu Agente de Seguros y Especialista en Transporte de Confianza"
        },
        description: "Con más de 25 años de experiencia en seguros y servicios personalizados para camiones, entiendo los desafíos únicos de los negocios de transporte. Mi compromiso es ofrecerte recursos adaptados y un servicio excepcional para impulsar el éxito de tu negocio.",
        features: [
          { text: "Atención bilingüe personalizada", icon: <GlobeIcon className="h-6 w-6 text-blue-500" /> },
          { text: "Disponibilidad 24/7 para emergencias y consultas", icon: <ClockIcon className="h-6 w-6 text-green-500" /> },
          { text: "Recursos adaptados a tus necesidades específicas", icon: <TargetIcon className="h-6 w-6 text-yellow-500" /> },
          { text: "Amplio conocimiento de la industria del transporte", icon: <TruckIcon className="h-6 w-6 text-red-500" /> },
          { text: "Compromiso con las mejores tarifas y servicio", icon: <SparklesIcon className="h-6 w-6 text-purple-500" /> }
        ]
      },
      testimonials: {
        title: "Lo Que Dicen Mis Clientes",
        items: [
          {
            quote: "Raquel no solo me ahorró dinero, sino que me guió personalmente en el proceso de iniciar mi negocio de transporte.",
            author: "Carlos R., Propietario-Operador"
          },
          {
            quote: "Su servicio bilingüe hizo que todo fuera sencillo. Siempre está disponible cuando la necesito.",
            author: "María L., Propietaria de Flota"
          },
          {
            quote: "Gracias a Raquel, pude navegar los requisitos legales y de seguros sin estrés.",
            author: "Juan D., Empresario de Transporte"
          }
        ]
      },
      contact: {
        title: "Comencemos Tu Viaje hacia el xito",
        subtitle: "Estoy aquí para ofrecerte experiencia personalizada al mejor precio",
        name: "Nombre Completo",
        email: "Correo Electrónico",
        phone: "Teléfono",
        message: "Mensaje",
        send: "Enviar Mensaje"
      },
      footer: {
        description: "Dedicada a ofrecer seguros y recursos excepcionales para camiones con el mejor servicio y precios competitivos.",
        contact: "Contáctame",
        followUs: "Sígueme",
        rights: "© 2024 Raquel Martinez Insurance & Trucking Solutions. Todos los derechos reservados.",
        license: "Lic # 4320792"
      },
      chat: {
        title: "Chat con Raquel",
        status: "En línea | Respuesta en minutos",
        placeholder: "Escribe tu mensaje...",
        send: "Enviar",
        welcome: "¡Hola! Soy Raquel Martinez. ¿Cómo puedo ayudarte personalmente hoy con tus necesidades de seguro y soluciones para camiones? Recuerda, ¡ofrezco las mejores tarifas del mercado!"
      },
      cta: {
        floating: "Chatea Conmigo",
      }
    },
    en: {
      nav: {
        title: "Raquel Martinez Insurance & Trucking Solutions",
        language: "Español",
        menu: {
          services: "Services",
          about: "About Me",
          testimonials: "Testimonials",
          contact: "Contact"
        }
      },
      whyChooseMe: {
        title: "Why Choose Me as Your Insurance Agent and Transportation Specialist?",
        reasons: [
          {
            title: "Unmatched Experience",
            description: "With over 25 years in the industry, I deeply understand the unique needs of truckers like you.",
            icon: <AwardIcon className="h-12 w-12 text-yellow-500" />
          },
          {
            title: "Significant Savings",
            description: "My relationships with top insurers guarantee you the best rates tailored to your business.",
            icon: <DollarSignIcon className="h-12 w-12 text-green-500" />
          },
          {
            title: "Personalized Service",
            description: "I provide focused attention, ensuring your specific needs are met with care and precision.",
            icon: <UserIcon className="h-12 w-12 text-blue-500" />
          },
          {
            title: "Support Available Anytime",
            description: "Reliable assistance whenever you need it, giving you complete peace of mind.",
            icon: <HeadphonesIcon className="h-12 w-12 text-purple-500" />
          }
        ]
      },
      services: {
        title: "Tailored Services for Your Success",
        subtitle: "Comprehensive solutions designed for your unique business, offering the best quality at the most competitive price",
        insurance: "Insurance Products",
        additional: "Additional Services",
        cta: "Get a Personalized Quote",
        askRaquel: "Ask Raquel"
      },
      about: {
        title: {
          en: "Raquel Martinez: Your Trusted Insurance Agent and Transportation Specialist",
          es: "Raquel Martinez: Tu Agente de Seguros y Especialista en Transporte de Confianza"
        },
        description: "With over 25 years of experience in trucking insurance and personalized offerings, I understand the unique challenges of transportation businesses. My commitment is to deliver tailored resources and exceptional service to help your business thrive.",
        features: [
          { text: "Personalized bilingual attention", icon: <GlobeIcon className="h-6 w-6 text-blue-500" /> },
          { text: "24/7 availability for emergencies and inquiries", icon: <ClockIcon className="h-6 w-6 text-green-500" /> },
          { text: "Customized resources for your specific needs", icon: <TargetIcon className="h-6 w-6 text-yellow-500" /> },
          { text: "Extensive knowledge of the transportation industry", icon: <TruckIcon className="h-6 w-6 text-red-500" /> },
          { text: "Commitment to the best rates and service", icon: <SparklesIcon className="h-6 w-6 text-purple-500" /> }
        ]
      },
      testimonials: {
        title: "What My Clients Say",
        items: [
          {
            quote: "Raquel not only saved me money but guided me personally through the process of starting my trucking business.",
            author: "Carlos R., Owner-Operator"
          },
          {
            quote: "Her bilingual service made everything straightforward. She is always available when I need her.",
            author: "Maria L., Fleet Owner"
          },
          {
            quote: "Thanks to Raquel, I navigated legal and insurance requirements without stress.",
            author: "John D., Transportation Entrepreneur"
          }
        ]
      },
      contact: {
        title: "Let's Start Your Journey to Success",
        subtitle: "I am here to offer personalized expertise at the best price",
        name: "Full Name",
        email: "Email",
        phone: "Phone",
        message: "Message",
        send: "Send Message"
      },
      footer: {
        description: "Dedicated to offering exceptional trucking insurance and resources with the best service and competitive pricing.",
        contact: "Contact Me",
        followUs: "Follow Me",
        rights: "© 2024 Raquel Martinez Insurance & Trucking Solutions. All rights reserved.",
        license: "Lic # 4320792"
      },
      chat: {
        title: "Chat with Raquel",
        status: "Online | Response in minutes",
        placeholder: "Type your message...",
        send: "Send",
        welcome: "Hi there! This is Raquel Martinez. How can I personally assist you today with your trucking insurance and solutions needs? Remember, I offer the best rates in the market!"
      },
      cta: {
        floating: "Chat with Me",
      }
    }
  }

  const t = texts[language]

  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const openChat = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      (window.Tawk_API as { maximize: () => void }).maximize();
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Facetune_15-11-2024-19-09-49-Qytpau906efmZ1Qt0LqPBK40v2G5em.jpeg"
                  alt="Raquel Martinez"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-blue-600">Raquel Martinez</span>
                  <span className="text-xs text-gray-600">Insurance & Trucking Solutions</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                {Object.entries(t.nav.menu).map(([key, value]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    onClick={() => scrollToSection(key)}
                  >
                    {value}
                  </Button>
                ))}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={language}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                      onClick={toggleLanguage}
                    >
                      <GlobeIcon className="h-4 w-4 mr-2" />
                      {t.nav.language}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white border-t"
              >
                <div className="container mx-auto px-4 py-4 space-y-2">
                  {Object.entries(t.nav.menu).map(([key, value]) => (
                    <Button
                      key={key}
                      variant="ghost"
                      className="w-full justify-start text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      onClick={() => scrollToSection(key)}
                    >
                      {value}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                    onClick={toggleLanguage}
                  >
                    <GlobeIcon className="h-4 w-4 mr-2" />
                    {t.nav.language}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="pt-20 bg-gradient-to-br from-blue-900 to-blue-700">
          <div className="container mx-auto px-4 relative flex flex-col md:flex-row items-center justify-center py-12 md:py-24">
            <div className="w-full md:w-1/2 text-white z-10 mb-8 md:mb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBannerIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {heroBanners[currentBannerIndex].title[language]}
                  </h1>
                  <p className="text-xl sm:text-2xl mb-6 text-blue-200">
                    {heroBanners[currentBannerIndex].subtitle[language]}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-blue-900 hover:from-yellow-500 hover:to-orange-600 text-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                      onClick={() => scrollToSection('contact')}
                    >
                      {heroBanners[currentBannerIndex].cta[language]}
                    </Button>
                    <Button 
                      onClick={openChat}
                      className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 px-10 py-4 text-lg font-semibold rounded-lg border-2 border-transparent hover:border-blue-600 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Chat with Me
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative overflow-hidden rounded-lg mt-8 md:mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBannerIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImages[currentBannerIndex]}
                    alt="Trucking services"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Why Choose Me Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t.whyChooseMe.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.whyChooseMe.reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4">{reason.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 bg-gray-100" ref={servicesRef}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t.services.title}</h2>
              <p className="text-xl text-center text-gray-600 mb-12">{t.services.subtitle}</p>
            </motion.div>
            <Tabs defaultValue="insurance" className="w-full">
              <TabsList className="w-full flex flex-col sm:flex-row justify-center mb-8">
                <TabsTrigger value="insurance" className="text-lg px-6 py-3 w-full sm:w-auto">{t.services.insurance}</TabsTrigger>
                <TabsTrigger value="additional" className="text-lg px-6 py-3 w-full sm:w-auto">{t.services.additional}</TabsTrigger>
              </TabsList>
              <TabsContent value="insurance">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.insurance.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ServiceCard service={service} language={language} scrollToSection={scrollToSection} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="additional">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.additional.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ServiceCard service={service} language={language} scrollToSection={scrollToSection} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                onClick={openChat}
              >
                {t.services.cta}
              </Button>
            </div>
          </div>
        </section>

        {/* About Raquel Section */}
        <section id="about" className="py-16 bg-white" ref={aboutRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Facetune_15-11-2024-19-09-49-Qytpau906efmZ1Qt0LqPBK40v2G5em.jpeg"
                  alt="Raquel Martinez"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-lg mx-auto md:mx-0"
                />
              </motion.div>
              <motion.div
                className="md:w-1/2 md:pl-12"
                initial={{ opacity: 0, x: 50 }}
                animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">{t.about.title[language]}</h2>
                <p className="text-gray-600 mb-6 text-center md:text-left">{t.about.description}</p>
                <ul className="space-y-4">
                  {t.about.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={aboutInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      {feature.icon}
                      <span className="ml-3">{feature.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 bg-gray-100" ref={testimonialsRef}>
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {t.testimonials.title}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.testimonials.items.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StarIcon className="h-8 w-8 text-yellow-400 mb-4" />
                  <p className="text-gray-600 mb-4">&quot;{testimonial.quote}&quot;</p>
                  <p className="font-semibold">{testimonial.author}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t.contact.title}</h2>
            <p className="text-xl text-center text-gray-600 mb-12">{t.contact.subtitle}</p>
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Input
                    type="text"
                    placeholder={t.contact.name}
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder={t.contact.email}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder={t.contact.phone}
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                  />
                </div>
                <Textarea
                  placeholder={t.contact.message}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  className="mb-6"
                  rows={4}
                />
                <div className="text-center">
                  <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
                    {t.contact.send}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Raquel Martinez</h3>
                <p className="mb-4">{t.footer.description}</p>
                <p className="text-sm">{t.footer.license}</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4">{t.footer.contact}</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <a href="tel:+1234567890">+1 (234) 567-890</a>
                  </li>
                  <li className="flex items-center">
                    <MailIcon className="h-5 w-5 mr-2" />
                    <a href="mailto:raquel@example.com">raquel@example.com</a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4">{t.footer.followUs}</h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                    <FacebookIcon className="h-6 w-6" />
                  </a>
                  <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                    <TwitterIcon className="h-6 w-6" />
                  </a>
                  <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                    <InstagramIcon className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-blue-800 text-center">
              <p>{t.footer.rights}</p>
            </div>
          </div>
        </footer>

        {/* Tawk.to Integration */}
        <TawkToWidget />
      </div>
    </>
  )
}