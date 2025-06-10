
import { TrendingUp, Users, Building, MapPin } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "2,500+",
    label: "Candidats Actifs",
    color: "text-blue-600"
  },
  {
    icon: Building,
    number: "500+",
    label: "Entreprises Partenaires",
    color: "text-green-600"
  },
  {
    icon: TrendingUp,
    number: "1,000+",
    label: "Offres Disponibles",
    color: "text-purple-600"
  },
  {
    icon: MapPin,
    number: "10",
    label: "Départements Couverts",
    color: "text-red-600"
  }
];

export const Stats = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
