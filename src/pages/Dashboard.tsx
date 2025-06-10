
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Users, Eye, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: applications } = useQuery({
    queryKey: ['my-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_posts(title, company_id, companies(name))
        `)
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: myJobs } = useQuery({
    queryKey: ['my-jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('job_posts')
        .select('*')
        .eq('posted_by', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && userProfile?.user_type === 'employeur'
  });

  const statusColors = {
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'vu': 'bg-blue-100 text-blue-800',
    'accepte': 'bg-green-100 text-green-800',
    'refuse': 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    'en_attente': 'En attente',
    'vu': 'Vu',
    'accepte': 'Accepté',
    'refuse': 'Refusé'
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Veuillez vous connecter pour accéder à votre tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {userProfile?.first_name} !
          </h1>
          <p className="text-gray-600">
            Gérez vos candidatures et votre profil depuis votre tableau de bord
          </p>
        </div>

        <Tabs defaultValue={userProfile?.user_type === 'employeur' ? 'jobs' : 'applications'} className="space-y-6">
          <TabsList>
            {userProfile?.user_type === 'candidat' && (
              <TabsTrigger value="applications">
                <FileText className="w-4 h-4 mr-2" />
                Mes candidatures
              </TabsTrigger>
            )}
            {userProfile?.user_type === 'employeur' && (
              <TabsTrigger value="jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Mes offres
              </TabsTrigger>
            )}
            <TabsTrigger value="profile">
              <Settings className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
          </TabsList>

          {userProfile?.user_type === 'candidat' && (
            <TabsContent value="applications" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total candidatures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{applications?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">En attente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {applications?.filter(a => a.status === 'en_attente').length || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Acceptées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {applications?.filter(a => a.status === 'accepte').length || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {applications?.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {application.job_posts?.title}
                          </CardTitle>
                          <CardDescription>
                            {application.job_posts?.companies?.name}
                          </CardDescription>
                        </div>
                        <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                          {statusLabels[application.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Candidature envoyée le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      {application.cover_letter && (
                        <p className="mt-2 text-sm text-gray-700">
                          Lettre de motivation incluse
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {applications?.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Aucune candidature pour le moment</p>
                      <Button onClick={() => navigate('/jobs')} className="mt-4">
                        Découvrir les offres
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}

          {userProfile?.user_type === 'employeur' && (
            <TabsContent value="jobs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Offres publiées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{myJobs?.length || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {myJobs?.reduce((sum, job) => sum + (job.views_count || 0), 0) || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Candidatures reçues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {myJobs?.reduce((sum, job) => sum + (job.applications_count || 0), 0) || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes offres d'emploi</h2>
                <Button onClick={() => navigate('/post-job')}>
                  Publier une offre
                </Button>
              </div>

              <div className="space-y-4">
                {myJobs?.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>{job.location}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={job.is_active ? "default" : "secondary"}>
                            {job.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {job.is_featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Sponsorisé
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {job.views_count} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applications_count} candidatures
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Voir les candidatures
                          </Button>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {myJobs?.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Aucune offre publiée pour le moment</p>
                      <Button onClick={() => navigate('/post-job')} className="mt-4">
                        Publier votre première offre
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )}

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et professionnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Informations personnelles</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nom :</strong> {userProfile?.first_name} {userProfile?.last_name}</p>
                      <p><strong>Email :</strong> {userProfile?.email}</p>
                      <p><strong>Type de compte :</strong> {userProfile?.user_type}</p>
                      <p><strong>Localisation :</strong> {userProfile?.location || 'Non renseignée'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Abonnement</h3>
                    <div className="space-y-2 text-sm">
                      <Badge variant="outline">
                        {userProfile?.subscription || 'Gratuit'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button className="mt-6">
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
