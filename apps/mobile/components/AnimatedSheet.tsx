import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const SCREEN_H = Dimensions.get('window').height;
const DURATION = 260;

/**
 * Bottom sheet with decoupled backdrop + panel animations.
 * - Backdrop: fades in at full size (opacity 0 -> 1)
 * - Panel: slides up from off-screen (translateY SCREEN_H -> 0)
 */
export function AnimatedSheet({ visible, onClose, children }: Props) {
  const backdrop = useRef(new Animated.Value(0)).current;
  const panel = useRef(new Animated.Value(SCREEN_H)).current;
  const [mounted, setMounted] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(panel, {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(panel, {
          toValue: SCREEN_H,
          duration: DURATION,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            ...StyleSheetAbsoluteFill,
            backgroundColor: 'rgba(0,0,0,0.7)',
            opacity: backdrop,
          }}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}
          pointerEvents="box-none"
        >
          <Animated.View style={{ transform: [{ translateY: panel }] }}>{children}</Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
