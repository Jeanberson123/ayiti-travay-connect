
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, Search, Heart, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', searchTerm, categoryFilter, locationFilter],
    queryFn: async () => {
      let query = supabase
        .from('job_posts')
        .select(`
          *,
          companies(name, logo_url, location)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const categories = [
    { value: 'informatique', label: 'Informatique' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'comptabilite', label: 'Comptabilité' },
    { value: 'ong', label: 'ONG' },
    { value: 'education', label: 'Éducation' },
    { value: 'sante', label: 'Santé' },
    { value: 'ingenierie', label: 'Ingénierie' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'autre', label: 'Autre' }
  ];

  const jobTypes = {
    'temps_plein': 'Temps plein',
    'temps_partiel': 'Temps partiel',
    'stage': 'Stage',
    'freelance': 'Freelance',
    'contrat': 'Contrat'
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour postuler",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Candidature existante",
            description: "Vous avez déjà postulé à cette offre",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        await supabase.rpc('increment_job_applications', { job_id: jobId });
        toast({
          title: "Candidature envoyée",
          description: "Votre candidature a été envoyée avec succès",
        });
      }
    } catch (error) {
      console.error('Error applying:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi",
        variant: "destructive"
      });
    }
  };

  const handleViewJob = async (jobId: string) => {
    await supabase.rpc('increment_job_views', { job_id: jobId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">Chargement des offres...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Offres d'emploi</h1>
          
          {/* Filtres de recherche */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Rechercher un emploi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Input
                  placeholder="Localisation"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="space-y-6">
          {jobs?.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {job.companies?.logo_url && (
                        <img 
                          src={job.companies.logo_url} 
                          alt={job.companies.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.companies?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">
                        {jobTypes[job.job_type as keyof typeof jobTypes]}
                      </Badge>
                      <Badge variant="outline">
                        {categories.find(c => c.value === job.category)?.label}
                      </Badge>
                      {job.is_remote && (
                        <Badge className="bg-green-100 text-green-800">Télétravail</Badge>
                      )}
                      {job.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Sponsorisé</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Eye className="w-4 h-4" />
                      {job.views_count} vues
                    </div>
                    {job.salary_min && job.salary_max && (
                      <div className="text-lg font-semibold text-blue-600">
                        {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} {job.currency}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {new Date(job.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewJob(job.id)}
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Sauvegarder
                    </Button>
                    <Button
                      onClick={() => handleApply(job.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Postuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune offre trouvée avec ces critères</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
