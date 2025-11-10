"use client";
import React from "react";
import Button from "./Button";
import { Modal } from "../ui/modal";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <Modal 
        isOpen={open} 
        onClose={onCancel}
        className="max-w-[500px] p-6"
    >
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button color="gray" onClick={onCancel}>Batal</Button>
          <Button color="red" onClick={onConfirm}>Ya, Lanjutkan</Button>
        </div>
    </Modal>
  );
}
