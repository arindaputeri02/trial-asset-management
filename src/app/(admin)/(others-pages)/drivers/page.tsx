"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import ConfirmModal from "@/components/atoms/ConfirmModal";

interface DriverFormData {
  id: number;
  name: string;
  vehicle: string;
  licenseNo: string;
  company: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<DriverFormData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchDrivers = async () => {
    const res = await fetch("/api/drivers");
    const data = await res.json();
    setDrivers(data);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      await fetch("/api/drivers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId }),
      });
      setShowModal(false);
      fetchDrivers();
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manajemen Driver</h1>
      <Button
        color="blue"
        className="mb-4"
        onClick={() => (window.location.href = "/drivers/form")}
      >
        + Tambah Driver
      </Button>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Kendaraan</th>
            <th className="border p-2">Plat Nomor</th>
            <th className="border p-2">Perusahaan</th>
            <th className="border p-2 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">{v.name}</td>
              <td className="border p-2">{v.vehicle}</td>
              <td className="border p-2">{v.licenseNo}</td>
              <td className="border p-2">{v.company}</td>
              <td className="border p-2 flex gap-2">
                <Button
                  color="blue"
                  className="text-xs"
                  onClick={() =>
                    (window.location.href = `/drivers/form?id=${v.id}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  color="red"
                  className="text-xs"
                  onClick={() => handleDelete(v.id)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        open={showModal}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus data ini?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
