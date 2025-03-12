import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface AlertPopupProps {
    title: string;
    message: string;
    onClose: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ title, message, onClose }) => {
    return (
        <View style={styles.popup}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <Button title="Close" onPress={onClose} />
        </View>
    );
};

const styles = StyleSheet.create({
    popup: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
    message: { fontSize: 14, marginBottom: 10 },
});

export default AlertPopup;
