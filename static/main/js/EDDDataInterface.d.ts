interface UpdateRecord {
    time: number;
    user: number;
}
interface LineRecord {
    id: number;
    name: string;
    description: string;
    active: boolean;
    control: boolean;
    replicate: any;
    contact: any;
    experimenter: number;
    meta: any;
    strain: number[];
    carbon: number[];
    exp: number;
    modified: UpdateRecord;
    created: UpdateRecord;
    n: any;
    m: any;
    s: any;
    cs: any;
    md: any;
    dis: any;
    ctrl: any;
    con: any;
}
interface AssayRecord {
    id: any;
    name: string;
    description: string;
    active: boolean;
    meta: any;
    lid: number;
    pid: number;
    mod: number;
    exp: number;
    measurements: number[];
    metabolites: number[];
    transcriptions: number[];
    proteins: number[];
    an: string;
    des: string;
    dis: boolean;
    md: any;
    met_c: number;
    tra_c: number;
    pro_c: number;
    mea_c: number;
}
interface AssayMeasurementRecord {
    id: number;
    assay: number;
    type: number;
    compartment: string;
    values: any[];
    aid: number;
    dis: boolean;
    lid: number;
    mf: number;
    mt: number;
    mst: number;
    mq: number;
    mtdf: number;
    uid: number;
    d: any[];
}
interface MeasurementTypeRecord {
    id: number;
    name: string;
    sn: string;
    family: string;
}
interface MetaboliteTypeRecord extends MeasurementTypeRecord {
    ans: string[];
    f: string;
    mm: number;
    cc: number;
    chgn: number;
    kstr: string;
    _l: any;
    selectString: string;
}
interface ProteinTypeRecord extends MeasurementTypeRecord {
}
interface GeneTypeRecord extends MeasurementTypeRecord {
}
interface EDDData {
    currentStudyID: number;
    currentUserID: number;
    parsedPermissions: any[];
    currentUserHasPageWriteAccess: boolean;
    EnabledUserIDs: number[];
    UserIDs: number[];
    Users: {
        [x: number]: any;
    };
    Protocols: {
        [x: number]: any;
    };
    MeasurementTypes: {
        [x: number]: MeasurementTypeRecord;
    };
    MetaboliteTypeIDs: number[];
    MetaboliteTypes: {
        [x: number]: MetaboliteTypeRecord;
    };
    ProteinTypeIDs: number[];
    ProteinTypes: {
        [x: number]: ProteinTypeRecord;
    };
    GeneTypeIDs: number[];
    GeneTypes: {
        [x: number]: ProteinTypeRecord;
    };
    MetaDataTypeIDs: number[];
    MetaDataTypes: {
        [x: number]: any;
    };
    MeasurementTypeCompartmentIDs: number[];
    MeasurementTypeCompartments: {
        [x: number]: any;
    };
    UnitTypeIDs: number[];
    UnitTypes: {
        [x: number]: any;
    };
    Labelings: any[];
    Strains: {
        [x: number]: any;
    };
    EnabledCSourceIDs: number[];
    CSourceIDs: number[];
    CSources: {
        [x: number]: any;
    };
    ExchangeIDs: number[];
    Exchanges: {
        [x: number]: any;
    };
    SpeciesIDs: number[];
    Species: any[];
    Studies: {
        [x: number]: any;
    };
    StudiesSize: number;
    StudiesStart: number;
    EnabledLineIDs: number[];
    Lines: {
        [x: number]: LineRecord;
    };
    EnabledAssayIDs: number[];
    Assays: {
        [x: number]: AssayRecord;
    };
    AssayMeasurementIDs: number[];
    AssayMeasurements: {
        [x: number]: AssayMeasurementRecord;
    };
    MetaDataTypesRelevant: any[];
    startMetaData: any[];
}
declare var EDDData: EDDData;
