import { PrismaClient } from "@prisma/client";
import { createService } from "../actions";
import { Plus } from "lucide-react";

const prisma = new PrismaClient();

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Services Manager</h1>
        <p className="text-foreground/60 mt-2">Manage the core services offered by APEX EVENT.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl h-fit shadow-sm">
          <h2 className="text-xl font-heading font-bold mb-4 text-foreground">Add New Service</h2>
          <form action={createService} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Title</label>
              <input type="text" name="title" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Cover Image URL</label>
              <input type="url" name="imageUrl" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Description</label>
              <textarea name="description" rows={4} required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none"></textarea>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="featured" id="featured" className="rounded bg-white border-gray-200" />
              <label htmlFor="featured" className="text-sm text-foreground/80">Highlight as Specialty (Golden Badge)</label>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded-lg flex justify-center items-center space-x-2 hover:bg-primary/90 transition-colors shadow-sm">
              <Plus size={20} />
              <span>Add Service</span>
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-sm group">
              {service.featured && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
                  Exclusive Specialty
                </div>
              )}
              <div className="h-40 bg-gray-100 overflow-hidden">
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-xl text-foreground">{service.title}</h3>
                <p className="text-sm text-foreground/60 mt-2">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
