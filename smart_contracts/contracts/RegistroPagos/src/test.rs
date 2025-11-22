#![cfg(test)]

use super::*;
use soroban_sdk::{vec, Env, String};

  #[test]
    fn test_crear_y_consultar() {
        let env = Env::default();
        let contract_id = env.register_contract(None, BaseDatosContract);
        let client = BaseDatosContractClient::new(&env, &contract_id);

        // Inicializar
        client.inicializar();

        // Crear registros
        let id1 = client.crear_registro(
            &String::from_str(&env, "Juan Perez"),
            &1000,
            &String::from_str(&env, "2024-01-15 10:30:00"),
        );
        
        let id2 = client.crear_registro(
            &String::from_str(&env, "Maria Lopez"),
            &2500,
            &String::from_str(&env, "2024-01-15 11:45:00"),
        );

        // Verificar IDs
        assert_eq!(id1, 1);
        assert_eq!(id2, 2);

        // Consultar por ID
        let registro = client.obtener_por_id(&1).unwrap();
        assert_eq!(registro.persona, String::from_str(&env, "Juan Perez"));
        assert_eq!(registro.monto, 1000);
    }