
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search, Send, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Créez votre profil",
    description: "Inscrivez-vous gratuitement et créez un profil professionnel complet avec votre CV."
  },
  {
    icon: Search,
    title: "Recherchez des emplois",
    description: "Explorez des milliers d'offres d'emploi et de stages adaptés à vos compétences."
  },
  {
    icon: Send,
    title: "Postulez facilement",
    description: "Candidatez en un clic aux offres qui vous intéressent directement via la plateforme."
  },
  {
    icon: CheckCircle,
    title: "Décrochez votre emploi",
    description: "Recevez des réponses des employeurs et planifiez vos entretiens d'embauche."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez votre emploi idéal en 4 étapes simples
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute -mt-2 ml-8">
                    <span className="bg-blue-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
