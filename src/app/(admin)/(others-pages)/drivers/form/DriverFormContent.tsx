"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import ConfirmModal from "@/components/atoms/ConfirmModal";

interface ItemData {
  id: number;
}

export default function DriverFormContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [form, setForm] = useState({ name: "", vehicle: "", licenseNo: "", company: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetch("/api/drivers")
        .then((res) => res.json())
        .then((data) => {
          const found = data.find((x: ItemData) => x.id === Number(id));
          if (found) setForm(found);
        });
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSave = async () => {
    await fetch("/api/drivers", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    router.push("/drivers");
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-4">
        {id ? "Edit Driver" : "Tambah Driver"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="border p-2 w-full rounded"
        />
        <input
          name="vehicle"
          value={form.vehicle}
          onChange={handleChange}
          placeholder="Kendaraan"
          className="border p-2 w-full rounded"
        />
        <input
          name="licenseNo"
          value={form.licenseNo}
          onChange={handleChange}
          placeholder="Plat Nomor"
          className="border p-2 w-full rounded"
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Perusahaan"
          className="border p-2 w-full rounded"
        />
        <Button type="submit" color="blue">
          Simpan
        </Button>
      </form>

      <ConfirmModal
        open={showModal}
        title="Konfirmasi Simpan"
        message="Apakah data sudah benar dan ingin disimpan?"
        onConfirm={confirmSave}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
