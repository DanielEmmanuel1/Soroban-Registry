use crate::auth::AuthManager;
use crate::cache::{CacheConfig, CacheLayer};
use crate::health_monitor::HealthMonitorStatus;
use crate::resource_tracking::ResourceManager;
use prometheus::Registry;
use sqlx::PgPool;
use std::sync::atomic::AtomicBool;
use std::sync::{Arc, RwLock};
use std::time::Instant;

/// Application state shared across handlers
#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub started_at: Instant,
    pub cache: Arc<CacheLayer>,
    pub registry: Registry,
    pub job_engine: Arc<soroban_batch::engine::JobEngine>,
    pub is_shutting_down: Arc<AtomicBool>,
    pub health_monitor_status: HealthMonitorStatus,
    pub auth_mgr: Arc<RwLock<AuthManager>>,
    pub resource_mgr: Arc<RwLock<ResourceManager>>,
}

impl AppState {
    pub fn new(
        db: PgPool,
        registry: Registry,
        job_engine: Arc<soroban_batch::engine::JobEngine>,
        is_shutting_down: Arc<AtomicBool>,
    ) -> Self {
        let config = CacheConfig::from_env();
        let auth_manager = match AuthManager::from_env() {
            Ok(manager) => manager,
            Err(err) => {
                #[cfg(test)]
                {
                    let _ = err;
                    // Keep tests deterministic when JWT_SECRET is not set in local environments.
                    AuthManager::new("test-jwt-secret-at-least-32-chars".to_string())
                }
                #[cfg(not(test))]
                {
                    panic!("JWT config validated at startup: {:?}", err)
                }
            }
        };
        let auth_mgr = Arc::new(RwLock::new(auth_manager));
        let resource_mgr = Arc::new(RwLock::new(ResourceManager::new()));
        Self {
            db,
            started_at: Instant::now(),
            cache: Arc::new(CacheLayer::new(config)),
            registry,
            job_engine,
            is_shutting_down,
            health_monitor_status: HealthMonitorStatus::default(),
            auth_mgr,
            resource_mgr,
        }
    }
}
