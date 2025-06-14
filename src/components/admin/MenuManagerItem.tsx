
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Move, Eye, EyeOff, Pencil, Save } from "lucide-react";

interface MenuItemProps {
  item: {
    id: number;
    label: string;
    path: string;
    visible: boolean;
  };
  editId: number | null;
  isDragging: boolean;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  onDrop: (id: number) => void;
  onEdit: (id: number, label: string, path: string) => void;
  onSave: (id: number, label: string, path: string) => void;
  onCancelEdit: () => void;
  onUpdateEdited: (label: string, path: string) => void;
  editedLabel: string;
  editedPath: string;
  onToggleItem: (id: number, visible: boolean) => void;
}

const MenuManagerItem = ({
  item,
  editId,
  isDragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onSave,
  onCancelEdit,
  onUpdateEdited,
  editedLabel,
  editedPath,
  onToggleItem,
}: MenuItemProps) => {
  return (
    <div
      className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable
      onDragStart={() => onDragStart(item.id)}
      onDragEnd={onDragEnd}
      onDragOver={e => e.preventDefault()}
      onDrop={() => onDrop(item.id)}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          <Move className="h-4 w-4 text-gray-500" />
          {editId === item.id ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                onSave(item.id, editedLabel, editedPath);
              }}
              className="flex items-center gap-2"
            >
              <input
                className="px-2 py-1 border rounded text-xs w-28"
                value={editedLabel}
                autoFocus
                onChange={e => onUpdateEdited(e.target.value, editedPath)}
                placeholder="Menu name"
              />
              <input
                className="px-2 py-1 border rounded text-xs w-36"
                value={editedPath}
                onChange={e => onUpdateEdited(editedLabel, e.target.value)}
                placeholder="/link"
              />
              <Button size="icon" variant="ghost" type="submit" title="Save" className="ml-1">
                <Save className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" type="button" onClick={onCancelEdit} title="Cancel">
                ✕
              </Button>
            </form>
          ) : (
            <>
              <span className="font-medium">{item.label}</span>
              <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">
                ({item.path})
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item.id, item.label, item.path)}
                title="Edit menu item"
                className="ml-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={item.visible ? "default" : "outline"}>
          {item.visible ? "Visible" : "Hidden"}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleItem(item.id, !item.visible)}
          disabled={item.label === "Home"}
          title={item.visible ? "Hide" : "Show"}
        >
          {item.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MenuManagerItem;
