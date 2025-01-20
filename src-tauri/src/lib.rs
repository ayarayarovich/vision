// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use jwt_simple::{claims::Claims, prelude::*};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use specta::Type;
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

#[derive(Serialize, Deserialize, Type)]
struct GreetPayload {
    name: String,
}

#[derive(Serialize, Debug, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
struct GetIAMTokenData {
    expires_at: String,
    iam_token: String
}

#[tauri::command]
#[specta::specta]
fn greet(payload: GreetPayload) -> String {
    format!("Hello, {}! You've been greeted from Rust!", payload.name)
}

#[tauri::command]
#[specta::specta]
fn get_iam() -> Option<GetIAMTokenData> {
    //
    let key_id = "ajefmqs10pu4novtmkus";
    let service_account_id = "ajemjgfbtg3fs19831mo";
    let private_key = "PLEASE DO NOT REMOVE THIS LINE! Yandex.Cloud SA Key ID <ajefmqs10pu4novtmkus>\n-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEp0DryUGho4t7\nzi4tcR2THvQFa2lcorO36zYS/7VlDrBHEj7zkVpRb8fnBUYYdGXE6l4oVmQtZqcE\nOSZ8d30enBUo0ry6QAYbSaRd6NGxvLf4RxATK54uGkLi4UDCmYlqQCS+D/ltQgqc\niWK2/DavQ6QZTqb+bm3SS2jHW/wNmsmcn7UuEzotT12jqnvKpPD580wGJwpQpLSY\nBu6gQLoPVYz2l4bGGZbop5qkdgROkGtsL2CZIOVvxenpqN6L7R6vKmu9tCp0gVb/\n9qU9M0hV6j86tIJdYuZDjX2zCY04nELg9VGW4t+8TfGyPPd6SdpK3ETDQgzP/DMm\n4EoHvMt1AgMBAAECggEABpQIKBd2cKILuwuK/K4MDNRVEwfH9uIM38L2qAzR19j1\njPFL6zzlANR/W/66OScV2Yjz8Ca3qwx123ddR2HTNAk0CRvVx5JM0DdsJVBHLMpI\nCkViR/84I8IbsB9UEqO7aGwWw+QvBGo729xSpxXNGdQfXYp3ZNJzZsrc3s7N9yx6\n8spfVi7dsBShq9lnw4MmwTM6st9+8RsTfQfnkVK8v+ONK5ZMtCgC8NQRLHWOzvAo\nhwMNAi9Xu7Y0tp+NSoI6ry/n3D4iSAw1YzuzK9tALUvVGjaqU+nmWBedoVAEzpMC\ngI34QCXsH7XO/SZzX90w2e4DKa/sO0QpPV8JlsaZ/wKBgQDqStusxSJ4xlMTGHSb\ncb5dOJRJRi3zHjnaVQgGIHJ5bcHOQCQ1ugTdRyosldT+8LDpwHhoGOdaIAV9nwLi\nS3CiHbjqvJGaChs2z0aUnGKnlWaJGxvSIXxDqvTTC5QMuDhIxikQfs5Yk05D22mj\nb+ESLA59M+OSDwx50ruCRfDyGwKBgQDW36P7rn6NlkfJzaBNXxfWX14Z8YVJLwC/\nESIJ/j4FraDHHFbAPyaWLSMf87l+IWUPf48IIkxAH1srbk4AAez9AmKivbs+IKG1\nDqn8AtYCM1WPDQLbTsWub8GaKj2tP1LcWIq6aHISGuwl7RPyUqbs7cgHAM32WW3i\nUaO8uxKRrwKBgDK25XouadnOxCi8AHGtW1F+b8q0oDmh70/tXAFHgL/8HBlzFON0\nUp07TEu+Ww6cNw9CFE4kJeACUm3wv4UQY18UI/TbwIChc2aX02VTvJ8d3cYL0ifY\nC7fyB3CvbuqZ7cUC79ycNjpCGIzjr6grDYMLek9rrfTtwPuVu/TlAtTFAoGBANU3\nxnkQhfPplALkUJV2LylCKRaFW0VrpsnyLlzMNK9dw5TQwiSyhY+v6pLiPsayTJ48\nbaocnp1igA1wv2Wyg3/sxgPHUe4sY0pO6s5v4fz9A4GX36XPXMnji7F3CQzJMWgF\nVGP1EHx2yq43uvtSmOGycjLA0aAKzccuS9QTrjFxAoGAfkAdCgeZKGXUiAh44fnI\nsqEo75ktZn6kBJ5wmF4sLDDipFZmLMyKrpbyCCIusbu1rOqACsYqZkN1T3OLfR+8\niH0FVP2wBjA6vgejBzVbMskxSg7SW0stKcxYJayzd5mUo0OdZZ+dyLm+1Fv5L1Xn\nlgY+EAxbWlY7BAXGK7LOC64=\n-----END PRIVATE KEY-----\n";

    let claims = Claims::create(Duration::from_secs(3600))
        .with_audience("https://iam.api.cloud.yandex.net/iam/v1/tokens")
        .with_issuer(service_account_id);

    let key_pair = PS256KeyPair::from_pem(private_key)
        .ok()?
        .with_key_id(key_id);
    let token = key_pair.sign(claims).unwrap();

    let client = reqwest::blocking::Client::new();
    let request_payload = json!({
        "jwt": token
    });
    let iam: GetIAMTokenData = client
        .post("https://iam.api.cloud.yandex.net/iam/v1/tokens")
        .body(request_payload.to_string())
        .send()
        .ok()?
        .json()
        .ok()?;

    println!("{:?}", iam);

    Some(iam)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![greet, get_iam]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(Typescript::default(), "../src/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
