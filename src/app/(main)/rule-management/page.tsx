"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateTireMutation, useDeleteTireMutation, useGetAllTireQuery, useUpdateStatusTireMutation, useUpdateTireMutation } from "@/features/rule/ruleApi";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

type Tire = {
  _id: string;
  tireName: string;
  tireCoins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const getApiErrorMessage = (error: unknown): string => {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    const data = errObj.data as Record<string, unknown> | undefined;

    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof (data.error as Record<string, unknown>)?.message === "string") {
      return (data.error as Record<string, unknown>).message as string;
    }
    if (errObj.error && typeof errObj.error === "string") return errObj.error;
    if (errObj.error && typeof (errObj.error as Record<string, unknown>)?.message === "string") {
      return (errObj.error as Record<string, unknown>).message as string;
    }
  }
  return "Something went wrong.";
};

export default function RuleManagementPage() {
  const { data, isLoading } = useGetAllTireQuery({ page: 1 });
  const [createTire, { isLoading: isCreating }] = useCreateTireMutation();
  const [updateTire, { isLoading: isUpdating }] = useUpdateTireMutation();
  const [updateStatusTire] = useUpdateStatusTireMutation();
  const [deleteTire, { isLoading: isDeleting }] = useDeleteTireMutation();
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTire, setEditingTire] = useState<Tire | null>(null);

  const tires = data?.data || [];

  const openCreateModal = () => {
    setEditingTire(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tire: Tire) => {
    setEditingTire(tire);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTire(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const tireName = (formData.get("tireName") as string)?.trim();
    const tireCoins = Number(formData.get("tireCoins"));

    if (!tireName || Number.isNaN(tireCoins)) {
      toast.error("Please enter valid tire name and coins.");
      return;
    }

    const payload = {
      tireName,
      tireCoins,
    };

    try {
      if (editingTire) {
        await updateTire({ id: editingTire._id, data: payload }).unwrap();
        toast.success("Tire updated successfully.");
      } else {
        await createTire(payload).unwrap();
        toast.success("Tire created successfully.");
      }
      closeModal();
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      toast.error(message || (editingTire ? "Failed to update tire." : "Failed to create tire."));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this tire?");
    if (!confirmed) return;

    try {
      await deleteTire(id).unwrap();
      toast.success("Tire deleted successfully.");
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      toast.error(message || "Failed to delete tire.");
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    setStatusUpdatingId(id);
    try {
      await updateStatusTire({ id, isActive }).unwrap();
      toast.success("Tire status updated.");
    } catch (error: unknown) {
      const message = getApiErrorMessage(error);
      toast.error(message || "Failed to update tire status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rule Management</h1>
          <p className="text-sm text-gray-500">Manage reward tiers and rule tires.</p>
        </div>

        <Button onClick={openCreateModal} className="inline-flex items-center gap-2 bg-[#4A6752] text-white hover:bg-[#3f593f]">
          <Plus className="h-4 w-4" />
          Create Tire
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table className="min-w-full">
          <TableHeader className="bg-[#F8FAF7]">
            <TableRow>
              <TableHead className="px-4 py-3">Tire Name</TableHead>
              <TableHead className="px-4 py-3">Tire Coins</TableHead>
              <TableHead className="px-4 py-3">Active</TableHead>
              <TableHead className="px-4 py-3">Created At</TableHead>
              <TableHead className="px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  Loading tires...
                </TableCell>
              </TableRow>
            ) : tires.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  No tires found.
                </TableCell>
              </TableRow>
            ) : (
              tires.map((tire: Tire) => (
                <TableRow key={tire._id} className="border-b last:border-b-0">
                  <TableCell className="px-4 py-4 font-medium text-gray-800">{tire.tireName}</TableCell>
                  <TableCell className="px-4 py-4 text-gray-700">{tire.tireCoins}</TableCell>
                  <TableCell className="px-4 py-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tire.isActive}
                        onCheckedChange={(checked) => handleStatusToggle(tire._id, Boolean(checked))}
                        disabled={statusUpdatingId === tire._id}
                        className="data-[state=checked]:bg-[#4A6752]"
                      />
                      {statusUpdatingId === tire._id && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-500">{new Date(tire.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-4 text-right text-gray-700">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(tire)} className="text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(tire._id)} className="ml-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95%] max-w-lg rounded-lg border-none p-0">
          <form onSubmit={handleSubmit}>
            <div className="rounded-[2rem] bg-white p-6 sm:p-8">
              <DialogHeader className="relative mb-4">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {editingTire ? "Edit Tire" : "Create Tire"}
                </DialogTitle>
                <DialogClose className="absolute right-0 top-0 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200" />
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-700">Tire Name</Label>
                  <Input
                    name="tireName"
                    defaultValue={editingTire?.tireName ?? ""}
                    required
                    placeholder="Enter tire name"
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4A6752] focus:ring-[#4A6752]"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-700">Tire Coins</Label>
                  <Input
                    name="tireCoins"
                    type="number"
                    defaultValue={editingTire?.tireCoins ?? ""}
                    required
                    min={0}
                    placeholder="Enter coins"
                    className="h-12 rounded-xl border-gray-200 focus:border-[#4A6752] focus:ring-[#4A6752]"
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeModal} className="h-12 w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="h-12 w-full text-white sm:w-auto" disabled={isCreating || isUpdating || isDeleting}>
                  {editingTire ? "Update Tire" : "Save Tire"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
