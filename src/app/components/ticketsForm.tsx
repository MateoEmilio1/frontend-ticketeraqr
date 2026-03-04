import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { crearTicket } from "@/app/services/ticketService";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Ticket } from "@/types/tickets";
import { useState } from "react";

const ticketSchema = z.object({
  idCliente: z.coerce.number().min(1, "Debe seleccionar un cliente"),
  idTipoTicket: z.coerce.number().min(1, "Debe seleccionar un tipo de ticket"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function TicketForm({ onTicketCreated }: { onTicketCreated: (ticket: Ticket) => void }) {
  const [mensaje, setMensaje] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema) as unknown as Resolver<TicketFormData>,
  });

  const onFormSubmit = async (data: TicketFormData) => {
    setMensaje("");
    try {
      const res = await crearTicket(data);
      onTicketCreated(res.data);
      setMensaje("Ticket generado con éxito");
      reset();
    } catch (error: unknown) {
      setMensaje((error as any).message || "Error al crear ticket");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="cliente">ID Cliente</Label>
        <Input
          id="cliente"
          type="number"
          {...register("idCliente")}
          placeholder="Ej: 1"
          className={errors.idCliente ? "border-red-500" : ""}
        />
        {errors.idCliente && <p className="text-red-500 text-xs mt-1">{errors.idCliente.message}</p>}
      </div>

      <div>
        <Label htmlFor="tipo">Tipo de Ticket</Label>
        <select
          id="tipo"
          {...register("idTipoTicket")}
          className={`border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 ${errors.idTipoTicket ? "border-red-500" : "border-blue-300"}`}
        >
          <option value="">Selecciona un tipo</option>
          <option value="1">🎫 General</option>
          <option value="2">⭐ VIP</option>
          <option value="3">🎤 Backstage</option>
        </select>
        {errors.idTipoTicket && <p className="text-red-500 text-xs mt-1">{errors.idTipoTicket.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
      >
        {isSubmitting ? "Generando..." : "Obtener Ticket"}
      </Button>

      {mensaje && (
        <p className={`text-center mt-2 ${mensaje.includes("éxito") ? "text-green-600" : "text-red-600"}`}>
          {mensaje}
        </p>
      )}
    </form>
  );
}
