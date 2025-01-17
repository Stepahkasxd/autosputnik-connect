import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactSubmissions } from "@/components/admin/ContactSubmissions";
import { SupportTickets } from "@/components/admin/SupportTickets";
import { CarsManagement } from "@/components/admin/CarsManagement";
import { Header } from "@/components/Header";

const Admin = () => {
  const [activeTab] = useState("contacts");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Панель администратора</h1>
        
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="mb-8 bg-card/50 dark:bg-card/40">
            <TabsTrigger value="contacts">Заявки</TabsTrigger>
            <TabsTrigger value="support">Тех. поддержка</TabsTrigger>
            <TabsTrigger value="cars">Автомобили</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts">
            <ContactSubmissions />
          </TabsContent>

          <TabsContent value="support">
            <SupportTickets />
          </TabsContent>

          <TabsContent value="cars">
            <CarsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;