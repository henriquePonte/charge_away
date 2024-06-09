// types.ts

export type RootStackParamList = {
    LoginScreen: undefined;
    Register: undefined;
    Home: undefined;
    Locals: undefined;
    AddLocal: undefined;
    Chargers: undefined;
    LocalDetail: { locationId: string };
    ModifyLocal: { locationId: string };
    Availability: { locationId: string; };
    AddAvailability: { locationId: string; };
    ModifyAvailability: { availabilityId: string; };
    AddCharge: { locationId: string; userId: string };
};