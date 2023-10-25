package com.senior.project.backend.security.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenPayload {
    private String aud;
    private String iss;
    private int iat;
    private int nbf;
    private int exp;
    private String name;
    private String nonce;
    private String oid;
    @JsonProperty("preferred_username") private String prefferedUsername;
    private String rh;
    private String sub;
    private String tid;
    private String uti;
    private String ver;
}

// {
//   "aud": "ce4bbce1-ee95-4991-8367-c180902da560",
//   "iss": "https://login.microsoftonline.com/24e2ab17-fa32-435d-833f-93888ce006dd/v2.0",
//   "iat": 1698172551,
//   "nbf": 1698172551,
//   "exp": 1698176451,
//   "aio": "AYQAe/8UAAAAfBr5d6SzG0g8FTsJsUlfz9oa3cqfspEB8wu2shNXVEbHDEf9YRVsEXj8fhyzjHQT4NZ8XR15AV9+v7RHYIpgHg+EM13dWVquAD1VzGSLnTdwv15OZf9vSdKouStoAbxwBt/r+bgZRi2BQoUWCoyeQf6gXZl4mnCaGGyulLdnSEw=",
//   "idp": "https://sts.windows.net/9188040d-6c67-4c5b-b112-36a304b66dad/",
//   "name": "James Logan",
//   "nonce": "31e80c12-da7c-4ab2-a1a0-51261950e6b0",
//   "oid": "54c7d394-67a4-43d4-8673-980b52564c71",
//   "preferred_username": "james@dbej.net",
//   "rh": "0.AbcAF6viJDL6XUODP5OIjOAG3eG8S86V7pFJg2fBgJAtpWDJAAg.",
//   "sub": "FuxPHXK6dosxtWZ9Uqk60IKyb9EL9ubwKzKEDB6-qt0",
//   "tid": "24e2ab17-fa32-435d-833f-93888ce006dd",
//   "uti": "AYN7xiuSvkajY6c1XXF-AA",
//   "ver": "2.0"
// }
