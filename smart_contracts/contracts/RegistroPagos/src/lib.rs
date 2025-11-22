#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Vec};

#[derive(Clone)]
#[contracttype]
pub struct Registro {
    pub id: u128,
    pub persona: String,
    pub monto: u32,
    pub fecha_hora: String,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    ContadorId,
    Registro(u128),
    RegistrosPorPersona(String),
    RegistrosPorFecha(String),
}

#[contract]
pub struct BaseDatosContract;

#[contractimpl]
impl BaseDatosContract {
    /// Inicializa el contador de IDs
    pub fn inicializar(env: Env) {
        let contador_key = DataKey::ContadorId;
        if !env.storage().persistent().has(&contador_key) {
            env.storage().persistent().set(&contador_key, &0u128);
        }
    }

    /// Crea un nuevo registro
    pub fn crear_registro(
        env: Env,
        persona: String,
        monto: u32,
        fecha_hora: String,
    ) -> u128 {
        // Obtener y actualizar el contador
        let contador_key = DataKey::ContadorId;
        let mut id: u128 = env
            .storage()
            .persistent()
            .get(&contador_key)
            .unwrap_or(0);
        
        id += 1;
        env.storage().persistent().set(&contador_key, &id);

        // Crear el registro
        let registro = Registro {
            id,
            persona: persona.clone(),
            monto,
            fecha_hora: fecha_hora.clone(),
        };

        // Guardar el registro principal
        let registro_key = DataKey::Registro(id);
        env.storage().persistent().set(&registro_key, &registro);

        // Indexar por persona
        let persona_key = DataKey::RegistrosPorPersona(persona.clone());
        let mut ids_persona: Vec<u128> = env
            .storage()
            .persistent()
            .get(&persona_key)
            .unwrap_or(Vec::new(&env));
        ids_persona.push_back(id);
        env.storage().persistent().set(&persona_key, &ids_persona);

        // Indexar por fecha
        let fecha_key = DataKey::RegistrosPorFecha(fecha_hora.clone());
        let mut ids_fecha: Vec<u128> = env
            .storage()
            .persistent()
            .get(&fecha_key)
            .unwrap_or(Vec::new(&env));
        ids_fecha.push_back(id);
        env.storage().persistent().set(&fecha_key, &ids_fecha);

        id
    }

    /// Obtiene un registro por ID
    pub fn obtener_por_id(env: Env, id: u128) -> Option<Registro> {
        let key = DataKey::Registro(id);
        env.storage().persistent().get(&key)
    }

    /// Lista registros por persona
    pub fn listar_por_persona(env: Env, persona: String) -> Vec<Registro> {
        let persona_key = DataKey::RegistrosPorPersona(persona);
        let ids: Vec<u128> = env
            .storage()
            .persistent()
            .get(&persona_key)
            .unwrap_or(Vec::new(&env));

        let mut registros = Vec::new(&env);
        for id in ids.iter() {
            if let Some(registro) = Self::obtener_por_id(env.clone(), id) {
                registros.push_back(registro);
            }
        }
        registros
    }

    /// Lista registros por fecha
    pub fn listar_por_fecha(env: Env, fecha_hora: String) -> Vec<Registro> {
        let fecha_key = DataKey::RegistrosPorFecha(fecha_hora);
        let ids: Vec<u128> = env
            .storage()
            .persistent()
            .get(&fecha_key)
            .unwrap_or(Vec::new(&env));

        let mut registros = Vec::new(&env);
        for id in ids.iter() {
            if let Some(registro) = Self::obtener_por_id(env.clone(), id) {
                registros.push_back(registro);
            }
        }
        registros
    }

    /// Lista todos los registros (hasta el ID actual)
    pub fn listar_todos(env: Env) -> Vec<Registro> {
        let contador_key = DataKey::ContadorId;
        let max_id: u128 = env
            .storage()
            .persistent()
            .get(&contador_key)
            .unwrap_or(0);

        let mut registros = Vec::new(&env);
        for id in 1..=max_id {
            if let Some(registro) = Self::obtener_por_id(env.clone(), id) {
                registros.push_back(registro);
            }
        }
        registros
    }

    /// Obtiene el contador actual de IDs
    pub fn obtener_contador(env: Env) -> u128 {
        let contador_key = DataKey::ContadorId;
        env.storage().persistent().get(&contador_key).unwrap_or(0)
    }
}