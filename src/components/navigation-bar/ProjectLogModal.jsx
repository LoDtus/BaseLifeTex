import React from 'react';
import styles from './styles/ProjectLogModal.module.scss';

export default function ProjectLogModal({ onClose, logs = [] }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Nhật kí dự án</h2>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>
                <div className={styles.content}>
                    {logs.length > 0 ? (
                        logs.map((log, index) => (
                            <div key={index} className={styles.logItem}>
                                <p><strong>{log.date}</strong> - {log.message}</p>
                            </div>
                        ))
                    ) : (
                        <p>Chưa có nhật kí nào cho dự án này.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
