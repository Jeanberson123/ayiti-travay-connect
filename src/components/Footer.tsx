
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-400">JobAyiti</h3>
            <p className="text-gray-300">
              La plateforme #1 pour l'emploi en Haïti. Connectons les talents aux opportunités.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-600">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-600">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-600">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Rechercher un Emploi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Poster une Offre</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Entreprises</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">CV Builder</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Conseils Carrière</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Informatique & Tech</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Marketing & Vente</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">ONG & Humanitaire</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Éducation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Santé</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">contact@jobayiti.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+509 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Port-au-Prince, Haïti</span>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Newsletter</h5>
              <div className="flex gap-2">
                <Input 
                  placeholder="Votre email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 JobAyiti. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Conditions d'Utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Aide
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
