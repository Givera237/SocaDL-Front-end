// app/(dashboard)/parametres/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Users, Clock, Mail } from "lucide-react";

// Types
type UserRole = "Administrateur" | "Technicien" | "Lecture ARSEL";

interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Données mockées
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "franck.nzokou@facsciences-uy1.cm",
    role: "Administrateur",
  },
  {
    id: "2",
    email: "giveraango@gmail.com",
    role: "Administrateur",
  },
];

export default function ParametersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("Technicien");
  const [detectionDelay, setDetectionDelay] = useState(5);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      email: inviteEmail,
      role: inviteRole,
    };

    setUsers([...users, newUser]);
    setInviteEmail("");
    setInviteRole("Technicien");
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title="Paramètres"
        subtitle="Gestion des utilisateurs et configuration système"
      />

      <div className="space-y-6">
        {/* Section 1 : Inviter un utilisateur */}
        <Card className="border-[#E8E2D8]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1F2937] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#8A8478]" />
              Inviter un utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="email"
                placeholder="email@socadel.cm"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-[#F5F3EF] border-[#E8E2D8]"
              />
              <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)}>
                <SelectTrigger className="w-[180px] bg-[#F5F3EF] border-[#E8E2D8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrateur">Administrateur</SelectItem>
                  <SelectItem value="Technicien">Technicien</SelectItem>
                  <SelectItem value="Lecture ARSEL">Lecture ARSEL</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-[#F2751F] hover:bg-[#F2751F]/90"
                onClick={handleInvite}
              >
                Inviter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 : Liste des utilisateurs */}
        <Card className="border-[#E8E2D8]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1F2937] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8A8478]" />
              Utilisateurs ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF7F2] border-[#E8E2D8]">
                  <TableHead className="text-[#8A8478] font-medium">
                    UTILISATEUR
                  </TableHead>
                  <TableHead className="text-[#8A8478] font-medium">
                    RÔLE
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-[#E8E2D8]">
                    <TableCell className="flex items-center gap-2 text-[#1F2937]">
                      <Mail className="w-4 h-4 text-[#8A8478]" />
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: UserRole) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-[180px] bg-[#F5F3EF] border-[#E8E2D8]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrateur">Administrateur</SelectItem>
                          <SelectItem value="Technicien">Technicien</SelectItem>
                          <SelectItem value="Lecture ARSEL">Lecture ARSEL</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Section 3 : Configuration de détection */}
        <Card className="border-[#E8E2D8]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-[#1F2937] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8A8478]" />
              Configuration de détection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#1F2937]">
                  Délai de perte de communication (site en panne)
                </span>
                <Input
                  type="number"
                  value={detectionDelay}
                  onChange={(e) =>
                    setDetectionDelay(parseInt(e.target.value) || 0)
                  }
                  className="w-[80px] bg-[#F5F3EF] border-[#E8E2D8] font-[JetBrains Mono]"
                />
                <span className="text-sm text-[#1F2937]">minutes</span>
              </div>
              <p className="text-sm text-[#8A8478]">
                Un site est marqué « en panne » si aucune donnée n'est reçue pendant ce délai.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}