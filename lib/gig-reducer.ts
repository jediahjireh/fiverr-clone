export interface GigState {
  userId?: string;
  title: string;
  category: string;
  cover: string;
  images: string[];
  description: string;
  shortTitle: string;
  shortDesc: string;
  deliveryTime: number;
  revisionNumber: number;
  features: string[];
  price: number;
}

type GigAction =
  | {
      type: "CHANGE_INPUT";
      payload: { name: keyof GigState; value: string | number };
    }
  | { type: "ADD_IMAGES"; payload: { cover: string; images: string[] } }
  | { type: "ADD_FEATURE"; payload: string }
  | { type: "REMOVE_FEATURE"; payload: string }
  | { type: "SET_COVER"; payload: string }
  | { type: "ADD_ADDITIONAL_IMAGES"; payload: string[] };

export const INITIAL_STATE: GigState = {
  userId: undefined, // Will be set by session in the component
  title: "",
  category: "",
  cover: "",
  images: [],
  description: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,
  revisionNumber: 0,
  features: [],
  price: 0,
};

export const gigReducer = (state: GigState, action: GigAction): GigState => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    // add this case
    case "SET_COVER":
      return {
        ...state,
        cover: action.payload,
      };

    // add this case
    case "ADD_ADDITIONAL_IMAGES":
      return {
        ...state,
        images: [...state.images, ...action.payload],
      };

    case "ADD_FEATURE":
      return {
        ...state,
        features: [...state.features, action.payload],
      };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter(
          (feature) => feature !== action.payload,
        ),
      };
    default:
      return state;
  }
};
