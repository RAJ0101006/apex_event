export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { createEvent, deleteEvent } from "../actions";
import { Plus, Trash2 } from "lucide-react";

const prisma = new PrismaClient();

export default async function GalleryPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Gallery Manager</h1>
          <p className="text-foreground/60 mt-2">Manage past event photos and videos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to add new event */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl h-fit shadow-sm">
          <h2 className="text-xl font-heading font-bold mb-4 text-foreground">Add New Event</h2>
          <form action={createEvent} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Title</label>
              <input type="text" name="title" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Category</label>
              <select name="category" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none">
                <option value="Marriage">Marriage</option>
                <option value="Engagement">Engagement</option>
                <option value="Couple Entry">Couple Entry</option>
                <option value="Carnival">Carnival</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Image URL</label>
              <input type="url" name="imageUrl" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" placeholder="https://example.com/image.jpg" />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Description (Optional)</label>
              <textarea name="description" rows={3} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none"></textarea>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="featured" id="featured" className="rounded bg-white border-gray-200" />
              <label htmlFor="featured" className="text-sm text-foreground/80">Feature on Homepage</label>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded-lg flex justify-center items-center space-x-2 hover:bg-primary/90 transition-colors shadow-sm">
              <Plus size={20} />
              <span>Add Event</span>
            </button>
          </form>
        </div>

        {/* List of events */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {event.featured && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{event.category}</div>
                      <h3 className="font-heading font-bold text-lg text-foreground">{event.title}</h3>
                    </div>
                    <form action={deleteEvent.bind(null, event.id)}>
                      <button 
                        type="submit" 
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 shadow-xs flex-shrink-0"
                        title="Remove event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                  {event.description && <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{event.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

