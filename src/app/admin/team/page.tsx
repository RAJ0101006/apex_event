import { PrismaClient } from "@prisma/client";
import { createTeamMember } from "../actions";
import { Plus } from "lucide-react";

const prisma = new PrismaClient();

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Team & Crew Manager</h1>
        <p className="text-foreground/60 mt-2">Manage team profiles displayed on the website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl h-fit shadow-sm">
          <h2 className="text-xl font-heading font-bold mb-4 text-foreground">Add Team Member</h2>
          <form action={createTeamMember} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Name</label>
              <input type="text" name="name" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Role / Designation</label>
              <input type="text" name="role" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" placeholder="e.g. Creative Decor Stylist" />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-1">Profile Image URL</label>
              <input type="url" name="imageUrl" required className="w-full bg-white border border-gray-200 rounded-lg p-2 text-foreground focus:border-primary outline-none" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="visible" id="visible" defaultChecked className="rounded bg-white border-gray-200" />
              <label htmlFor="visible" className="text-sm text-foreground/80">Public Visibility</label>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded-lg flex justify-center items-center space-x-2 hover:bg-primary/90 transition-colors shadow-sm">
              <Plus size={20} />
              <span>Add Member</span>
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {team.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden text-center relative group shadow-sm">
              {!member.visible && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <span className="bg-gray-200 text-foreground px-2 py-1 rounded text-xs font-bold shadow-sm">Hidden</span>
                </div>
              )}
              <div className="h-48 bg-gray-100 overflow-hidden border-b border-gray-200">
                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-lg text-foreground">{member.name}</h3>
                <p className="text-xs text-primary mt-1 uppercase tracking-wider font-bold">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
