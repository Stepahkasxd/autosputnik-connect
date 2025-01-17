import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactSubmissions } from "@/components/admin/ContactSubmissions";
import { Header } from "@/components/Header";

const Admin = () => {
  const [activeTab] = useState("contacts");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
        
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="contacts">Заявки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts">
            <ContactSubmissions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;