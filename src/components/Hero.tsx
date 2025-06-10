
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-red-400/20 rounded-full blur-xl"></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Plateforme #1 en Haïti
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Trouvez Votre
            <span className="block text-yellow-300">Emploi de Rêve</span>
            en Haïti
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Connectez talents haïtiens et opportunités locales. Plus de 1000+ offres d'emploi et stages disponibles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg"
              onClick={() => navigate('/jobs')}
            >
              <Search className="w-5 h-5 mr-2" />
              Chercher un Emploi
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold px-8 py-4 text-lg"
              onClick={() => navigate('/auth')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Poster une Offre
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">1000+</div>
              <div className="text-blue-100">Offres d'emploi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">500+</div>
              <div className="text-blue-100">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">2500+</div>
              <div className="text-blue-100">Candidats</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
