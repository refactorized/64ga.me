import { useState, useEffect } from 'preact/hooks';
import { currentUser, users, actions } from '../store';
import styles from './UserSelector.module.css';

export function UserSelector() {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest(`.${styles.userSelector}`)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleUserSelect = (user: any) => {
    actions.selectUser(user);
    setIsOpen(false);
  };

  return (
    <div class={styles.userSelector}>
      {currentUser.value ? (
        <div 
          class={styles.currentUser}
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentUser.value.name} ▼
        </div>
      ) : (
        <div 
          class={styles.currentUser}
          onClick={() => setIsOpen(!isOpen)}
        >
          Select User ▼
        </div>
      )}
      
      {isOpen && (
        <div class={styles.dropdown}>
          {users.value.length === 0 ? (
            <div class={styles.noUsers}>No users available</div>
          ) : (
            users.value.map((user) => (
              <button
                key={user.name}
                class={styles.dropdownItem}
                onClick={() => handleUserSelect(user)}
              >
                {user.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
