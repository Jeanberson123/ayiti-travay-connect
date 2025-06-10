
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";

export const SearchSection = () => {
  return (
    <section className="py-16 bg-white relative -mt-8 z-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Recherchez parmi plus de 1000 offres
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Titre du poste, entreprise..."
                  className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Select>
                  <SelectTrigger className="pl-10 py-3 text-lg border-2 border-gray-200">
                    <SelectValue placeholder="Localisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="port-au-prince">Port-au-Prince</SelectItem>
                    <SelectItem value="cap-haitien">Cap-Haïtien</SelectItem>
                    <SelectItem value="gonaives">Gonaïves</SelectItem>
                    <SelectItem value="jacmel">Jacmel</SelectItem>
                    <SelectItem value="cayes">Les Cayes</SelectItem>
                    <SelectItem value="remote">Télétravail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 font-semibold">
                Rechercher
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-gray-600">Recherches populaires:</span>
            {['Marketing', 'IT', 'Comptabilité', 'ONG', 'Stage'].map((tag) => (
              <Button 
                key={tag}
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
