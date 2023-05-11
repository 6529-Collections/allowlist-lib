import { AllowlistState } from 'src/allowlist/state-types/allowlist-state';

export const getItemPath = (param: {
  state: AllowlistState;
  itemId: string;
}): {
  phaseId: string | null;
  componentId: string | null;
  itemId: string | null;
} => {
  const { state, itemId } = param;
  const phase = Object.values(state.phases).find(
    (phase) =>
      !!Object.values(phase.components).find(
        (component) =>
          !!Object.values(component.items).find((item) => item.id === itemId),
      ),
  );
  if (!phase) {
    return {
      phaseId: null,
      componentId: null,
      itemId: null,
    };
  }

  const component = Object.values(phase.components).find(
    (component) =>
      !!Object.values(component.items).find((item) => item.id === itemId),
  );

  if (!component) {
    return {
      phaseId: phase.id,
      componentId: null,
      itemId: null,
    };
  }

  const item = component.items[itemId];

  if (!item) {
    return {
      phaseId: phase.id,
      componentId: component.id,
      itemId: null,
    };
  }

  return {
    phaseId: phase.id,
    componentId: component.id,
    itemId: item.id,
  };
};

export const getComponentPath = (param: {
  state: AllowlistState;
  componentId: string;
}): {
  phaseId: string | null;
  componentId: string | null;
} => {
  const { state, componentId } = param;
  const phase = Object.values(state.phases).find(
    (phase) =>
      !!Object.values(phase.components).find(
        (component) => component.id === componentId,
      ),
  );
  if (!phase) {
    return {
      phaseId: null,
      componentId: null,
    };
  }

  const component = Object.values(phase.components).find(
    (component) => component.id === componentId,
  );

  if (!component) {
    return {
      phaseId: phase.id,
      componentId: null,
    };
  }

  return {
    phaseId: phase.id,
    componentId: component.id,
  };
};
