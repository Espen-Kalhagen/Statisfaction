package com.kjellhaaland.statisfaction;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    // URL pointing to the desired login-page
    private final String URL_STARTUP = "http://www.uia.no";

    // Reference to the container-webview
    private WebView container;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        // Initialize the container web-view
        container = (WebView) findViewById(R.id.application_container);

        // Configure app
        this.configure();

    }
    /**
     * Configures the container
     *
     */
    private void configure()
    {

        // Prompts the user about locking the app to the screen
        this.startLockTask();

        // Loads the desired url into the webview
        container.loadUrl(URL_STARTUP);

        // Listens to url-loading events (When the user clicks a URL in the webView)
        // Opens the clicked URL in the container
        container.setWebViewClient(new WebViewClient(){

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                view.loadUrl(request.getUrl().toString());
                return false ;
            }
        });

    }

    //TODO: Load URL_STARTUP from server
    //TODO:

}
