
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Développeur Web Full Stack",
    company: "TechHaiti Solutions",
    location: "Port-au-Prince",
    type: "Temps plein",
    salary: "50,000 - 80,000 HTG",
    description: "Rejoignez notre équipe dynamique pour développer des solutions web innovantes pour le marché haïtien.",
    tags: ["React", "Node.js", "MongoDB"],
    logo: "🚀"
  },
  {
    id: 2,
    title: "Coordinateur de Projet ONG",
    company: "Hope for Haiti",
    location: "Cap-Haïtien",
    type: "Contrat",
    salary: "35,000 - 45,000 HTG",
    description: "Coordonner les projets de développement communautaire dans le nord d'Haïti.",
    tags: ["Gestion", "Terrain", "Communauté"],
    logo: "❤️"
  },
  {
    id: 3,
    title: "Assistant Comptable",
    company: "Cabinet Financier HT",
    location: "Port-au-Prince",
    type: "Stage",
    salary: "15,000 - 20,000 HTG",
    description: "Stage de 6 mois en comptabilité avec possibilité d'embauche.",
    tags: ["Comptabilité", "Excel", "Débutant"],
    logo: "💼"
  },
  {
    id: 4,
    title: "Chef de Marketing Digital",
    company: "Caribbean Media Group",
    location: "Pétion-Ville",
    type: "Temps plein",
    salary: "60,000 - 90,000 HTG",
    description: "Développer et exécuter les stratégies marketing digital pour nos clients.",
    tags: ["Marketing", "Social Media", "Analytics"],
    logo: "📱"
  },
  {
    id: 5,
    title: "Infirmier(ère) Diplômé(e)",
    company: "Hôpital Bernard Mevs",
    location: "Port-au-Prince",
    type: "Temps plein",
    salary: "40,000 - 55,000 HTG",
    description: "Rejoignez notre équipe médicale dédiée aux soins de qualité en Haïti.",
    tags: ["Santé", "Urgence", "Soins"],
    logo: "🏥"
  },
  {
    id: 6,
    title: "Professeur d'Anglais",
    company: "École Internationale d'Haïti",
    location: "Pétion-Ville",
    type: "Temps plein",
    salary: "30,000 - 40,000 HTG",
    description: "Enseigner l'anglais à des élèves du secondaire dans un environnement stimulant.",
    tags: ["Éducation", "Anglais", "Secondaire"],
    logo: "📚"
  }
];

export const FeaturedJobs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Offres d'Emploi Populaires
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleures opportunités d'emploi et de stage en Haïti
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{job.logo}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 leading-tight">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">{job.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-medium">{job.salary}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Postuler Maintenant
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8"
          >
            Voir Toutes les Offres
          </Button>
        </div>
      </div>
    </section>
  );
};
