import React from 'react';
import { Key, Star, Folder, Plus } from 'lucide-react';

const configs = {
  vault: {
    icon: <Key size={48} />,
    title: 'Nenhuma senha cadastrada',
    description: 'Adicione sua primeira senha para começar a usar o cofre seguro.',
    action: 'Adicionar Senha',
  },
  favorites: {
    icon: <Star size={48} />,
    title: 'Nenhum favorito ainda',
    description: 'Marque suas senhas mais usadas como favoritas para acessá-las rapidamente.',
  },
  categories: {
    icon: <Folder size={48} />,
    title: 'Nenhuma categoria criada',
    description: 'Organize suas senhas criando categorias como Trabalho, Streaming ou Bancos.',
    action: 'Criar Categoria',
  },
  search: {
    icon: <Key size={48} />,
    title: 'Nenhum resultado encontrado',
    description: 'Tente pesquisar por outro termo.',
  },
};

export default function EmptyState({ type = 'vault', onAction }) {
  const config = configs[type] || configs.vault;

  return (
    <div className="empty-state">
      <div className="empty-icon">{config.icon}</div>
      <h3>{config.title}</h3>
      <p>{config.description}</p>
      {config.action && onAction && (
        <button className="btn-primary" onClick={onAction}>
          <Plus size={18} />
          {config.action}
        </button>
      )}
    </div>
  );
}
